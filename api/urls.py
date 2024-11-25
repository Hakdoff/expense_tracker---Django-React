from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from api import views

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('register/', views.RegisterView.as_view()),
    path('income/', views.IncomeListView.as_view()),
    path('income/<int:pk>/', views.IncomeDetailView.as_view()),
    path('expense/', views.ExpenseListView.as_view()),
    path('expense/<int:pk>/', views.ExpenseDetailView.as_view()),
    path('bills/', views.BillListView.as_view()),
    path('bills/<int:pk>/', views.BillDetailView.as_view()),
    path('wishlist/', views.WishlistListView.as_view()),
    path('wishlist/<int:pk>/', views.WishlistDetailView.as_view()),
    path('savings/', views.SavingListView.as_view()),
    path('savings/<int:pk>/', views.SavingDetailView.as_view()),
    path('dashboard/', views.dashboard),
    path('', views.getRoutes),
]