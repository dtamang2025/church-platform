from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import SavedPost
from posts.models import Post
from posts.serializers import PostSerializer


class SavedPostListView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        saved_ids = SavedPost.objects.filter(user=self.request.user).values_list('post_id', flat=True)
        return Post.objects.filter(id__in=saved_ids)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_save(request, post_id):
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

    saved, created = SavedPost.objects.get_or_create(user=request.user, post=post)
    if not created:
        saved.delete()
        return Response({'saved': False})
    return Response({'saved': True})
