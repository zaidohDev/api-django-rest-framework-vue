from rest_framework import filters
from rest_framework.viewsets import ModelViewSet
from article.api.serializers import ArticleSerializer
from article.models import Article


class ArticleViewSet(ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('article_id', 'article_heading', 'article_body')