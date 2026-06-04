from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Community, CommunityMember
from .serializers import CommunitySerializer, CommunityMemberSerializer


class CommunityListCreateView(generics.ListCreateAPIView):
    serializer_class = CommunitySerializer

    def get_queryset(self):
        filter_type = self.request.query_params.get('filter', 'all')
        user = self.request.user
        if filter_type == 'mine':
            return Community.objects.filter(owner=user)
        elif filter_type == 'joined':
            return Community.objects.filter(members=user)
        return Community.objects.all()


class CommunityDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer

    def get_permissions(self):
        if self.request.method in ('PUT', 'PATCH', 'DELETE'):
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def join_community(request, pk):
    try:
        community = Community.objects.get(pk=pk)
    except Community.DoesNotExist:
        return Response({'error': 'Community not found'}, status=404)

    member, created = CommunityMember.objects.get_or_create(
        community=community, user=request.user,
        defaults={'role': CommunityMember.ROLE_MEMBER}
    )
    if not created:
        member.delete()
        return Response({'joined': False})
    return Response({'joined': True})


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def assign_role(request, pk, user_id):
    try:
        community = Community.objects.get(pk=pk)
        member = CommunityMember.objects.get(community=community, user_id=user_id)
        admin_member = CommunityMember.objects.get(community=community, user=request.user)
    except (Community.DoesNotExist, CommunityMember.DoesNotExist):
        return Response({'error': 'Not found'}, status=404)

    if admin_member.role != CommunityMember.ROLE_ADMIN and community.owner != request.user:
        return Response({'error': 'Not authorized'}, status=403)

    role = request.data.get('role')
    if role not in dict(CommunityMember.ROLE_CHOICES):
        return Response({'error': 'Invalid role'}, status=400)

    member.role = role
    member.save()
    return Response(CommunityMemberSerializer(member).data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def community_members(request, pk):
    try:
        community = Community.objects.get(pk=pk)
    except Community.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
    members = CommunityMember.objects.filter(community=community).select_related('user')
    return Response(CommunityMemberSerializer(members, many=True).data)
