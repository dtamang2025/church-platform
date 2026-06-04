from rest_framework import serializers, generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Song


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = '__all__'
        read_only_fields = ['id', 'added_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['added_by'] = self.context['request'].user
        return super().create(validated_data)


class IsPlatformAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.is_platform_admin


class SongListCreateView(generics.ListCreateAPIView):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    permission_classes = [IsPlatformAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'language']
    search_fields = ['title', 'author_name']


class SongDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    permission_classes = [IsPlatformAdmin]
