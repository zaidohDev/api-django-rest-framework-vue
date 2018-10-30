"""djangovue URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from article import urls as urls_articles
from rest_framework import routers
from article.api.viewsets import ArticleViewSet


router = routers.DefaultRouter()
router.register('article', ArticleViewSet, base_name='Article')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(urls_articles)),
    path('api/', include(router.urls)),
]
