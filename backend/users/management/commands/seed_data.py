from django.core.management.base import BaseCommand
from users.models import User
from communities.models import Community, CommunityMember
from posts.models import Post
from songbook.models import Song


class Command(BaseCommand):
    help = 'Seed the database with sample data'

    def handle(self, *args, **options):
        # Admin user
        admin, _ = User.objects.get_or_create(
            email='admin@church.com',
            defaults={'username': 'admin', 'global_role': 'admin', 'bio': 'Platform Administrator'}
        )
        admin.set_password('Admin@1234')
        admin.save()

        # Regular user
        user1, _ = User.objects.get_or_create(
            email='john@church.com',
            defaults={'username': 'john_worship', 'bio': 'Worship leader and guitarist'}
        )
        user1.set_password('User@1234')
        user1.save()

        # Community
        community, _ = Community.objects.get_or_create(
            name='Grace Community Church',
            defaults={'description': 'A welcoming community of believers', 'owner': admin}
        )
        CommunityMember.objects.get_or_create(
            community=community, user=admin,
            defaults={'role': 'admin'}
        )
        CommunityMember.objects.get_or_create(
            community=community, user=user1,
            defaults={'role': 'choir_member'}
        )

        # Sample lyrics
        amazing_grace_lyrics = [
            {"line": "Amazing grace how sweet the sound", "chords": [{"chord": "G", "position": 0}, {"chord": "C", "position": 8}, {"chord": "G", "position": 14}]},
            {"line": "That saved a wretch like me", "chords": [{"chord": "G", "position": 0}, {"chord": "D", "position": 6}]},
            {"line": "I once was lost but now am found", "chords": [{"chord": "G", "position": 0}, {"chord": "C", "position": 7}, {"chord": "G", "position": 13}]},
            {"line": "Was blind but now I see", "chords": [{"chord": "D", "position": 0}, {"chord": "G", "position": 9}]},
        ]

        # Songs
        Song.objects.get_or_create(
            title='Amazing Grace',
            defaults={
                'author_name': 'John Newton', 'category': 'traditional',
                'language': 'english', 'lyrics': amazing_grace_lyrics,
                'added_by': admin, 'is_shareable': True,
                'description': 'A classic hymn of redemption and grace'
            }
        )

        Song.objects.get_or_create(
            title='How Great Is Our God',
            defaults={
                'author_name': 'Chris Tomlin', 'category': 'worship',
                'language': 'english', 'added_by': admin, 'is_shareable': True,
                'lyrics': [
                    {"line": "The splendor of a King clothed in majesty", "chords": [{"chord": "C", "position": 0}]},
                    {"line": "Let all the earth rejoice all the earth rejoice", "chords": [{"chord": "Am", "position": 0}, {"chord": "F", "position": 8}]},
                ],
                'description': 'Contemporary worship anthem'
            }
        )

        # Posts
        Post.objects.get_or_create(
            title='Amazing Grace (G Major)',
            defaults={
                'author': user1, 'visibility': 'public',
                'description': 'Classic arrangement in G Major',
                'lyrics': amazing_grace_lyrics,
                'tags': ['traditional', 'hymn'],
                'language': 'english',
            }
        )

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
        self.stdout.write('Admin: admin@church.com / Admin@1234')
        self.stdout.write('User:  john@church.com / User@1234')
