from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Reaction
from posts.models import Post


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def react_to_post(request, post_id):
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=404)

    reaction_type = request.data.get('reaction_type', 'like')
    if reaction_type not in dict(Reaction.REACTION_TYPES):
        return Response({'error': 'Invalid reaction'}, status=400)

    existing = Reaction.objects.filter(user=request.user, post=post).first()
    if existing:
        if existing.reaction_type == reaction_type:
            existing.delete()
            return Response({'reacted': False, 'reaction_type': None})
        else:
            existing.reaction_type = reaction_type
            existing.save()
            return Response({'reacted': True, 'reaction_type': reaction_type})

    Reaction.objects.create(user=request.user, post=post, reaction_type=reaction_type)
    return Response({'reacted': True, 'reaction_type': reaction_type})
