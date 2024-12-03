from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db.models.signals import post_save
from django.utils.timezone import now

class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        
        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )
        
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, username, password=None):
        user = self.create_user(
            email=email,
            username=username,
            password=password,
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user
        
    def get_by_natural_key(self, email):
        return self.get(email=email)

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    # This is the critical line you were missing - it connects the UserManager
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.username
    
    # Required for custom user models
    def has_perm(self, perm, obj=None):
        return True if self.is_admin else False

    def has_module_perms(self, app_label):
        return True
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    full_name = models.CharField(max_length=300)
    bio = models.CharField(max_length=300)
    image = models.ImageField(default="default.jpg", upload_to="user_images")
    verified = models.BooleanField(default=False)
    
    def __str__(self):
        return self.full_name
    
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        
def save_user_profile(sender, instance,**kwargs):
    instance.profile.save()
    
post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)

class Income(models.Model):
    CATEGORY_CHOICES = [
        ('SALARY', 'Salary'),
        ('ALLOWANCE', 'Allowance'),
        ('GIFT', 'Gift'),
        ('OTHER', 'Other'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.IntegerField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='OTHER')
    date_received = models.DateTimeField()
    description = models.CharField(max_length=200)
    created_at = models.DateTimeField(default=now) 
    
    def __str__(self):
        return f"{self.user.username} - {self.amount}"
    
class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('FOOD', 'Food'),
        ('TRANSPORTATION', 'Transportation'),
        ('CLOTHING', 'Clothing'),
        ('SHOPPING', 'Shopping'),
        ('BILLS', 'Bills'),
        ('INSURANCE', 'Insurance'),
        ('HEALTHCARE', 'Healthcare'),
        ('UTILITIES', 'Utilities'),
        ('RENT', 'Rent'),
        ('SKINCARE', 'Skincare'),
        ('GYM', 'Gym'),
        ('GROCERY', 'Grocery'),
        ('FAMILY', 'Family'),
        ('OTHER', 'Other'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.IntegerField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='OTHER')
    date_spended = models.DateTimeField()
    description = models.CharField(max_length=200)
    created_at = models.DateTimeField(default=now) 
    
    def __str__(self):
        return f"{self.user.username} - {self.amount}"
    
class Saving(models.Model):
    CATEGORY_CHOICES = [
        ('SAVING', 'Saving'),
        ('EMERGENCY FUND', 'Emergency Fund'),
        ('EXTRA', 'Extra'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='OTHER')
    amount = models.IntegerField()
    date_saved = models.DateTimeField()
    created_at = models.DateTimeField(default=now) 
    
    def __str__(self):
        return f"{self.user.username} - {self.amount}"
    
class Bill(models.Model):
    CATEGORY_CHOICES = [
        ('GYM', 'Gym'),
        ('LIFE INSURANCE', 'Life Insurance'),
        ('ALLOWANCE', 'Allowance'),
        ('BAHAY', 'Bahay'),
        ('APARTMENT', 'Apartment'),
        ('EMERGENCY FUND', 'Emergency Fund'),
        ('SAVINGS', 'Savings'),
        ('EXTRA', 'Extra'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.IntegerField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='OTHER')
    due_date = models.CharField(max_length=100, default='OTHER')
    item = models.CharField(max_length=200)
    created_at = models.DateTimeField(default=now) 
    
    def __str__(self):
        return f"{self.user.username} - {self.amount} - {self.due_date}"
    
class Wishlist(models.Model):
    CATEGORY_CHOICES = [
        ('FOOD', 'Food'),
        ('MAKE UP', 'Makeup'),
        ('CLOTHING', 'Clothing'),
        ('SHOPPING', 'Shopping'),
        ('HEALTHCARE', 'Healthcare'),
        ('SKINCARE', 'Skincare'),
        ('BAG', 'Bag'),
        ('GROCERY', 'Grocery'),
        ('FAMILY', 'Family'),
        ('OTHER', 'Other'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(default="default.jpg", upload_to="wishlist_images/")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='OTHER')
    item = models.CharField(max_length=200)
    price = models.IntegerField()
    is_bought = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.username} - {self.item} - {self.price}"
    

    