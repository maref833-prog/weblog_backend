from database import SessionLocal
from models import User
from auth import get_password_hash

db = SessionLocal()

try:
    # پیدا کردن کاربر superadmin
    user = db.query(User).filter(User.username == "superadmin").first()
    
    if user:
        # آپدیت رمز
        user.hashed_password = get_password_hash("123456")
        user.role = "super_admin"
        db.commit()
        print("[OK] Password for superadmin changed to 123456")
        print("   username: superadmin")
        print("   role: super_admin")
    else:
        # ساختن کاربر جدید
        new_user = User(
            username="superadmin",
            email="super@example.com",
            hashed_password=get_password_hash("123456"),
            role="super_admin"
        )
        db.add(new_user)
        db.commit()
        print("[OK] User superadmin created")
        print("   username: superadmin")
        print("   password: 123456")
        print("   role: super_admin")
    
except Exception as e:
    print(f"[ERROR] {e}")
    db.rollback()
finally:
    db.close()