from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Post
from .serializers import PostSerializer


class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user


class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['language', 'visibility', 'community']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at']

    def get_queryset(self):
        user = self.request.user
        feed_type = self.request.query_params.get('feed', 'all')
        qs = Post.objects.select_related('author', 'community')

        if feed_type == 'following':
            following_ids = user.following.values_list('id', flat=True)
            qs = qs.filter(author_id__in=following_ids, visibility='public')
        elif feed_type == 'community':
            joined_ids = user.joined_communities.values_list('id', flat=True)
            qs = qs.filter(community_id__in=joined_ids)
        elif feed_type == 'mine':
            qs = qs.filter(author=user)
        else:
            qs = qs.filter(visibility='public')

        return qs


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.select_related('author', 'community')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrReadOnly]
