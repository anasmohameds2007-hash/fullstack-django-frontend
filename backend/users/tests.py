from django.test import TestCase
from django.contrib.auth.models import User
from .models import UserProfile


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_user_creation(self):
        self.assertEqual(self.user.username, 'testuser')
        self.assertTrue(self.user.check_password('testpass123'))

    def test_user_profile_creation(self):
        profile = UserProfile.objects.get(user=self.user)
        self.assertEqual(profile.user, self.user)
