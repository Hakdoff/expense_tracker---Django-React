from django.contrib import admin
from api.models import User, Profile, Income, Expense, Wishlist, Saving, Bill

class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']
    
class ProfileAdmin(admin.ModelAdmin):
    list_editable = ['verified']
    list_display = ['user','full_name', 'verified']
    
class IncomeAdmin(admin.ModelAdmin):
    list_display = ['user', 'amount', 'date_received']
    
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['user', 'amount', 'date_spended']
    
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'price', ]
    
class SavingAdmin(admin.ModelAdmin):
    list_display = ['user', 'amount', ]
    
class BillAdmin(admin.ModelAdmin):
    list_display = ['user', 'amount', 'due_date']

admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Income, IncomeAdmin)
admin.site.register(Expense, ExpenseAdmin)
admin.site.register(Wishlist, WishlistAdmin)
admin.site.register(Saving, SavingAdmin)
admin.site.register(Bill, BillAdmin)