"""
URL configuration for CAC5 project.
"""
from django.contrib import admin
from django.urls import path
from django.contrib.auth.decorators import login_required
from rest_framework.routers import SimpleRouter
from drf_spectacular.views import (
                                SpectacularAPIView,
                                SpectacularSwaggerView,
                                SpectacularRedocView,
)

from ChessAutoChess.views import (
                            auth,
                            room,
                            # UserView,
                            GameDetail,
)


router = SimpleRouter()

# router.register('api/users', UserView)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', auth),
    path('api/room/', room),
    path('api/room/<int:room_name>/', login_required(GameDetail.as_view())),
]

urlpatterns += router.urls

urlpatterns += [
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path(
        'api/schema/swagger-ui/',
        SpectacularSwaggerView.as_view(url_name='schema'),
        name='swagger-ui'
    ),
    path(
        'api/schema/redoc/',
        SpectacularRedocView.as_view(url_name='schema'),
        name='redoc'
    ),
]
