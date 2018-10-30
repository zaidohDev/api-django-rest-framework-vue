# api-django-rest-framework-vue
## Configurações básicas do nosso ambiente.

## crie um direitório para o projeto
* mkdir vue-api-django
* cd vue-api-django

## dentro do diretorio criado, crie e ativa uma virtualenv
* virtualenv -p python3 .vEnv
* . .vEnv/bin/activate

## instalando o django na versão 2.1.1
* pip install django==2.1.1

## crie o projeto usando o django
* django-admin startproject blog

## crie o app usando o django
* django-admin startapp article

## Faça as migrações e exec o runserver
* python manage.py migrate
* python manage.py runserver

obs: verifique se a pagina de boas vindas do django rodou.

## crie o model Article em models.py
*/article/models.py

class Article(models.Model):
    article_id = models.AutoField(primary_key=True)
    article_heading = models.CharField(max_length=255)
    article_body = models.TextField()
    
## registre models Article em admin.py
*/article/admin.py

from article.models import Article


admin.site.register(Article)

## add o app em definições de apps
*/blog/settings.py

INSTALLED_APPS = [
    
    'article',
    
]
## vamos instalar o django restframework para nossa api. Instale os intens abaixo:

*pip install djangorestframework
*pip install markdown       # Markdown support for the browsable API.
*pip install django-filter  # Filtering support

Em seguida add em settings.py

INSTALLED_APPS = (
    ...
    'rest_framework',
)


REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ]
}


## vamos gerenciar nossa url base
* blog/urls.py

- add
(...)
from rest_framework import routers

router = routers.DefaultRouter()
router.register('article', ArticleViewSet, base_name='Article')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]

## vamos gerenciar nossa url para o nosso app article. Iremos usar o TemplateView para
## renderizar nossas paginas

/article/urls.py

from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    path('article/', TemplateView.as_view(template_name='index.html')),
]


## Agora precisamos fazer um include desse arquivo na url base.

blog/urls.py

(...)
from article import urls as urls_articles

urlpatterns = [
    path('', include(urls_articles)),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]

oberve que em /article/urls.py estamos passando um arquivo index.html como template. 
Então precisamos criar este arquivo dentro de um diretório padrão do django:

Na raiz do projeto crie um diretório chamado: templates e dentro dele crie um arquivo
index.html. Precisamos fazer com que o django enxergue esse diretório de templates, add 
o caminho base:

o arquivo index.html contem o nosso vuejs.

blog/settings.py

TEMPLATES = [
    {
       ...
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
       ... 
    }
]

## vamos criar nosso serilizer e viewset
cri um diretório chamado api

article/api/

crie três arquivos:
__init__.py, serializers.py e viewsets.py

## serializers.py
from rest_framework.serializers import ModelSerializer
from article.models import Article


class ArticleSerializer(ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'
        
## viewsets.py
from rest_framework.viewsets import ModelViewSet
from article.api.serializers import ArticleSerializer
from article.models import Article


class ArticleViewSet(ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    
## vamos incluir no arquivo de rotas nossa viewset
/blog/urls.py

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

## vamos criar um superuser para termos acesso a nossa api
python manager.py createsuperuser

depois faça as migrações:

python manage.py makemigrations
python manage.py migrate

suda o servidor

python manage.py runserver

acesse sua api na url: http://127.0.0.1:8000/api/
e o seu index.html na url: http://127.0.0.1:8000/article/

# Agora vamos subir essa bagaça pro heroku

## crie um repor git
* git init 
* Create a file called `.gitignore` with the following content:
```
# See the name for you IDE
.idea
# If you are using sqlite3
*.sqlite3
# Name of your virtuan env
.vEnv
*pyc
```
* git add .
* git commit -m 'First commit'


## Escondendo a configuração da instância
* pip install python-decouple
* crie um arquivo .env no seu diretorio raiz e add:
- SECRET_KEY=SuaSecretykey(veja em blog/settings.py)
- DEBUG=True

### Settings.py
* from decouple import config
* SECRET_KEY = config('SECRET_KEY')
* DEBUG = config('DEBUG', default=False, cast=bool)

## Configure a base de dados
* pip install dj-database-url

### Settings.py
* from dj_database_url import parse as dburl

default_dburl = 'sqlite:///' + os.path.join(BASE_DIR, 'db.sqlite3')

DATABASES = {
    'default': config('DATABASE_URL', default=default_dburl, cast=dburl),
}


## Static files 
pip install dj-static

### wsgi
* from dj_static import Cling
* application = Cling(get_wsgi_application())

### Settings.py
* STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

## crie o requirements-dev.txt
pip freeze > requirements-dev.txt

## criar um arquivo arquivo requirements.txt e incluir referência ao arquivo anterior e adicionar mais dois requisitos* -r requirements-dev.txt
-r requirements-dev.txt
gunicorn
psycopg2==suaVersao

## Crie um arquivo Procfile e adicione o seguinte código
* web: gunicorn website.wsgi --log-file -

## Crie um arquivo runtime.txt e adicione o seguinte núcleo
* python-3.6.0

## Criando o aplicativo no Heroku
Faça uma conta free no heroku;

Você deve instalar ferramentas de CLI heroku em seu computador anteriormente (consulte http://bit.ly/2jCgJYW)
* aplicativos heroku: criar nome do aplicativo;

Lembre-se de pegar o endereço do aplicativo neste ponto.

## Configurando os hosts permitidos
inclua seu endereço nas diretivas ALLOWED_HOSTS em settings.py - Apenas o domínio, 


## Heroku instala o plugin de configuração
* heroku plugins:install heroku-config

### Enviando configurações de .env para Heroku (Você tem que estar dentro do seguinte, onde os arquivos .env são)
* heroku plugins:install heroku-config
* heroku config:push

### Para mostrar as configurações do heroku
* heroku config

## Publicando o aplicativo
* git add .
* git commit -m 'Configuring the app'
* git push heroku master --force

## Criando a base de dados
* heroku run python3 manage.py migrate

## Criando o usuário admin do Django
* heroku run python3 manage.py createsuperuser

## EXTRAS
### Você pode precisar desativar o collectstatic
* heroku config:set DISABLE_COLLECTSTATIC=1

### Alterando uma configuração específica
* heroku config:set DEBUG=True