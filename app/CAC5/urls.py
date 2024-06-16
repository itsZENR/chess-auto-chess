"""
URL configuration for CAC5 project.
"""
from django.contrib import admin
from django.urls import path, include
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
                            get_version
)


router = SimpleRouter()

# router.register('api/users', UserView)

api = [
    path('auth/', auth),
    path('room/', room),
    path('room/connect/<int:room_name>/', login_required(GameDetail.as_view())),
    path('version', get_version)
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api))    
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
