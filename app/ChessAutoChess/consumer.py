'''
Consumer(Потребитель) реализует логику работы вебсокета
'''
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async as db_s2a
import chess
import chess.engine
from icecream import ic
from .models import Game
import time


class GameConsumer(AsyncWebsocketConsumer):
    # "D:/Python_project/ChessAutoChess/app/ChessAutoChess/engine/stockfish-windows-x86-64/stockfish/stockfish-windows-x86-64.exe")
    engine = '/app/ChessAutoChess/engine/stockfish-ubuntu-x86-64/' + \
            'stockfish/stockfish-ubuntu-x86-64'
    # Создаем объект шахматной доски
    board = chess.Board()

    # Список индификаторов готовых игроков
    ready_player = {}

    #  Объект игры
    game = ''
    # Запушенна ли была уже игра
    game_start = False
    # список для хранения уникальных идентификаторов клиентов в комнате
    connected_clients = {}

    points = 10
    cost_dict = {'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9}

    color_is_white = True

    async def connect(self):
        # Создаем объект шахматной доски
        self.board = chess.Board()

        # # Очищаем доску
        self.board.clear()

        self.board.set_piece_at(chess.H8, chess.Piece(chess.KING, chess.BLACK))
        self.board.set_piece_at(chess.A1, chess.Piece(chess.KING, chess.WHITE))

        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        self.ready_player[self.room_name] = []
        ic(self.ready_player)

        # Добавление клиента в множество подключенных клиентов
        ic(self.connected_clients)

        if self.room_name not in self.connected_clients:
            self.connected_clients[self.room_name] = []

        self.connected_clients[self.room_name].append(self.scope["user"].id)

        self.game = await db_s2a(Game.objects.get)(id=self.room_name)

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name, self.channel_name
        )

        await self.accept()

        #  # Generate and store command if not already stored
        # command = get_command(self.room_name)
        # if command is None:
        #     command = generate_command()
        #     ic(command)
        #     store_command(self.room_name, command)

        # Send command to the player
        # await self.send(text_data=json.dumps({
        #     'command': command
        # }))

        if len(self.connected_clients[self.room_name]) == 2:

            # Если игрок подключается вторым, то он играет за черных
            self.color_is_white = False

            # Отправка сообщения в группу
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "game.status",
                                       "message": 'GameStart'}
            )

    async def disconnect(self, close_code):
        # Удаление клиента в множество подключенных клиентов
        self.connected_clients[self.room_name].remove(self.scope["user"].id)
        ic(self.connected_clients)

        if not self.connected_clients[self.room_name]:
            await self.stop_engine()

        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )

    async def stop_engine(self):
        if hasattr(self, 'engine'):
            self.engine.quit()
        self.game_start = False

    # Receive message from WebSocket
    async def receive(self, text_data):
        if not text_data:
            await self.send(text_data=json.dumps(
                {'error': 'Empty message received'}))
            return

        result = None

        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        ic(message)

        await self.send(text_data=json.dumps({
            'message': message
        }))

        # Если клиент запросил состояние своего цвета
        if message == 'Игрок':
            # Отправляем сообщение пользователю который сделал запрос
            await self.send(text_data=json.dumps(
                {"color_is_white": self.color_is_white}))

        # Если была нажата кнопка у одного из пользоваетлей
        elif message == 'Готов':
            # То получаем id пользователя нажавшего на кнопку
            user_id = self.scope['user'].id
            self.game = await db_s2a(Game.objects.get)(id=self.room_name)
            wpid = await db_s2a(lambda: self.game.white_player.id)()
            bpid = await db_s2a(lambda: self.game.black_player.id)()

            # И в этой игре уже подключенно два пользователя
            # и тот кто нажал кнопку "готов" является одним из двух игроков
            if not wpid == bpid \
                    and (wpid == user_id or bpid == user_id):
                # При этом записанно готовых игроков меньше двух
                # и пользователь который готов не был записан ранее
                # и игра не зупущенна
                if len(self.ready_player[self.room_name]) < 2 \
                        and user_id not in self.ready_player[self.room_name] \
                        and not self.game_start:
                    # То записываем этого пользователя
                    self.ready_player[self.room_name].append(user_id)

            if len(self.ready_player[self.room_name]) == 2 \
                    and not self.game_start:
                self.game_start = True
                await self.run_engine()

        else:
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name, {'type': 'chat.message',
                                       'message': message,
                                       'user': self.scope['user'].id
                                       })

    async def run_engine(self):
        self.engine = chess.engine.SimpleEngine.popen_uci(self.engine)

        while self.board.outcome() is None:
            start = time.time()
            result = self.engine.play(
                self.board, chess.engine.Limit(time=1.0)
            )
            end = time.time()

            if (end - start) * 10 ** 3 < 1000:
                time.sleep(1)

            move = result.move

            # Двигаем шахматные фигуры
            # в соответствии с ответом движка Stockfish
            self.board.push(move)

            # Отправляем собщение в группу
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "move.message",
                                        "move": str(move),
                                        'user': self.scope['user'].id
                                        }
            )

            # Отправляем сообщение пользователю который запустил игру
            await self.send(text_data=json.dumps({"move": str(move)}))

        self.engine.quit()
        result = self.board.outcome().result()
        await self.channel_layer.group_send(
            self.room_group_name, {'type': 'game.status',
                                   'message': result}
        )

        if self.game_start:
            ic(result)

            # Ебать копать, тут надо начинать считать очки
            # Надо понять, какой фигурой какой игрок походил,
            # и может ли он так сделать
            # Тут надо узнавать возможно ли поставить фигуру в указанное место

            # Если мы взяли новую фигуру и поставили её на доску
            if result[0] == 'spare':
                # Узнаем что за фигура
                piece = result[1][1]
                # Смотрим сколько она стоит
                cost = self.cost_dict[piece]
                # Если это не выходит за пределы баланса
                if not self.points - cost < 0:
                    # Отнимаем эту стоимость от баланса
                    self.points -= cost
                    # Отправляем сообщение в группу
                    await self.channel_layer.group_send(
                        self.room_group_name,  {'type': 'game.status',
                                                'message': result,
                                                'user': self.scope['user'].id,
                                                'points': self.points})
                else:
                    # Присылаем ошибку в поле error
                    pass

            # Если мы убрали уже существующую на доске фигуру
            elif result[2] == 'spare':
                # Узнаем что за фигура
                piece = result[1][1]
                # Если выбранная фигура не король
                if not piece == 'K':
                    # Смотрим сколько стоит фигура
                    cost = self.cost_dict[piece]
                    # Возвращаем её стоимость
                    self.points = self.points + cost
                    # Отправляем сообщение в группу
                    await self.channel_layer.group_send(
                        self.room_group_name,  {'type': 'game.status',
                                                'message': result,
                                                'user': self.scope['user'].id,
                                                'points': self.points})
                else:
                    # Присылаем ошибку в поле error
                    pass

            # Отправляем сообщение пользователю который запустил игру
            await self.send(text_data=json.dumps({"game_status": result}))

    async def chat_message(self, event):
        '''
        Receive message from room group
        '''
        message = event["message"]
        user_id = event['user']

        if isinstance(message, list):
            source = message[0].upper()
            piece = message[1]
            target = message[2].upper()
            # board = message[3]
            # score = message[4]

            if piece[0] == 'w':
                color = 'WHITE'
            else:
                color = 'BLACK'

            figures_dict = {'P': 'PAWN',
                            'N': 'KNIGHT',
                            'B': 'BISHOP',
                            'R': 'ROOK',
                            'Q': 'QUEEN',
                            'K': 'KING'}

            piece = figures_dict[piece[1]]

            if source == 'SPARE':
                exec(f'self.board.set_piece_at(chess.{target},'
                     f'chess.Piece(chess.{piece}, chess.{color}))')

            # Удаляем фигуру с клетки
            elif target == 'OFFBOARD':
                exec(f'self.board.remove_piece_at(chess.{source})')

            # Удаляем старую фигуру и ставим новую такую-же в новом месте,
            # тем самым реализуя перемещение
            else:
                exec(f'self.board.remove_piece_at(chess.{source})')
                exec(f'self.board.set_piece_at(chess.{target},'
                     f'chess.Piece(chess.{piece}, chess.{color}))')

        # Check if the message sender is not the current connection
        if str(user_id) != str(self.scope['user'].id):
            # Send message to WebSocket
            await self.send(text_data=json.dumps({
                'message': message
            }))
            print(message)
            print(self.board)

    async def move_message(self, event):
        message = event["move"]
        user_id = event['user']

        # Check if the message sender is not the current connection
        if str(user_id) != str(self.scope['user'].id):
            # Send message to WebSocket
            await self.send(text_data=json.dumps({
                'move': message
            }))

    async def game_status(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({"game_status": message}))
