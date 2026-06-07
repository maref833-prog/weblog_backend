from typing import Optional

# نسخه ساده ترجمه بدون نیاز به کتابخانه خارجی
async def translate_text(text: str, dest_lang: str = 'fa') -> Optional[str]:
    # فعلاً متن اصلی را برمی‌گرداند
    # بعداً می‌توانی از API واقعی استفاده کنی
    return text

async def translate_post_content(title: str, content: str, target_lang: str):
    translated_title = await translate_text(title, target_lang)
    translated_content = await translate_text(content, target_lang)
    return {
        "title": translated_title,
        "content": translated_content
    }