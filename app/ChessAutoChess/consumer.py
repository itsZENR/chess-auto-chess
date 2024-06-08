# game/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import chess
import chess.engine
from icecream import ic
from .models import Game
import time


class GameConsumer(AsyncWebsocketConsumer):
    engine = ''
    # Создаем объект шахматной доски
    board = chess.Board()

    # Список индификаторов готовых игроков
    ready_player = {}

    #  Объект игры
    game = ''
    # Запушенна ли была уже игра
    game_start = False
    # Статическое множество для хранения уникальных идентификаторов клиентов в комнате
    connected_clients = {}

    async def connect(self):
        # Создаем объект шахматной доски
        self.board = chess.Board()

        # # Очищаем доску
        self.board.clear()

        self.board.set_piece_at(chess.H8, chess.Piece(chess.KING, chess.BLACK))
        self.board.set_piece_at(chess.A1, chess.Piece(chess.KING, chess.WHITE))

        self.engine = chess.engine.SimpleEngine.popen_uci(
            # "D:/Python_project/ChessAutoChess/app/ChessAutoChess/engine/stockfish-windows-x86-64/stockfish/stockfish-windows-x86-64.exe")
            "/app/ChessAutoChess/engine/stockfish-ubuntu-x86-64/stockfish/stockfish-ubuntu-x86-64")

        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        self.ready_player[self.room_name] = []
        ic(self.ready_player)

        # Добавление клиента в множество подключенных клиентов
        ic(self.connected_clients)
        if not self.room_name in self.connected_clients:
            self.connected_clients[self.room_name] = []

        self.connected_clients[self.room_name].append(self.scope["user"].id)

        self.game = await database_sync_to_async(Game.objects.get)(id=self.room_name)

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name, self.channel_name
        )

        await self.accept()

        if len(self.connected_clients[self.room_name]) == 2:
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "game.status",
                                       "message": 'GameStart'}
            )

    async def disconnect(self, close_code):
        # Удаление клиента в множество подключенных клиентов
        self.connected_clients[self.room_name].remove(self.scope["user"].id)
        ic(self.connected_clients)

        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        result = None

        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        ic(message)

        await self.send(text_data=json.dumps({
            'message': message
        }))

        # Если была нажата кнопка у одного из пользоваетлей
        if message == 'Готов':
            # То получаем id пользователя нажавшего на кнопку
            user_id = self.scope['user'].id
            self.game = await database_sync_to_async(Game.objects.get)(id=self.room_name)
            white_player_id = await database_sync_to_async(lambda: self.game.white_player.id)()
            black_player_id = await database_sync_to_async(lambda: self.game.black_player.id)()

            # И в этой игре уже подключенно два пользователя и тот кто нажал кнопку "готов" является одним из двух игроков
            if not white_player_id == black_player_id \
                    and (white_player_id == user_id or black_player_id == user_id):
                # При этом записанно готовых игроков меньше двух и пользователь который готов не был записан ранее
                if len(self.ready_player[self.room_name]) < 2 \
                        and not user_id in self.ready_player[self.room_name] \
                        and not self.game_start:
                    # То записываем этого пользователя
                    self.ready_player[self.room_name].append(user_id)

            if not self.game_start and len(self.ready_player[self.room_name]) == 2:

                self.game_start = True
                while self.board.outcome() is None:
                    start = time.time()
                    result = self.engine.play(
                        self.board, chess.engine.Limit(time=1.0)
                    )
                    end = time.time()
                    if (end - start) * 10 ** 3 < 1000:
                        time.sleep(1)
                    move = result.move

                    # Двигаем шахматные фигуры в соответствии с ответом Stockfish
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

                result = self.board.outcome().result()

        else:
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name, {'type': 'chat.message',
                                       'message': message,
                                       'user': self.scope['user'].id
                                       }
            )

        if self.game_start:
            ic(result)
            # Отправляем собщение в группу
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "game.status",
                                       "message": result,
                                       'user': self.scope['user'].id
                                       }
            )

            # Отправляем сообщение пользователю который запустил игру
            await self.send(text_data=json.dumps({"gameStatus": result}))

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        user_id = event['user']

        if type(message) == list:

            source = message[0].upper()
            piece = message[1]
            target = message[2].upper()
            # board = message[3]
            # score = message[4]

            if piece[0] == 'w':
                color = 'WHITE'
            else:
                color = 'BLACK'

            figures_dict = {'P': 'PAWN', 'N': 'KNIGHT', 'B': 'BISHOP', 'R': 'ROOK', 'Q': 'QUEEN', 'K': 'KING'}
            piece = figures_dict[piece[1]]

            if source == 'SPARE':
                exec(f'self.board.set_piece_at(chess.{target}, chess.Piece(chess.{piece}, chess.{color}))')

            # Удаляем фигуру с клетки
            elif target == 'OFFBOARD':
                exec(f'self.board.remove_piece_at(chess.{source})')

            # Удаляем старую фигуру и ставим новую такую-же в новом месте, тем самым реализуя перемещение
            else:
                exec(f'self.board.remove_piece_at(chess.{source})')
                exec(f'self.board.set_piece_at(chess.{target}, chess.Piece(chess.{piece}, chess.{color}))')

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
        await self.send(text_data=json.dumps({"gameStatus": message}))