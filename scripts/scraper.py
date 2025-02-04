import sys
import json
from seleniumbase import Driver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Получаем URL из переданных аргументов
if len(sys.argv) > 1:
    url = sys.argv[1]
else:
    print("URL не передан!")
    sys.exit(1)

# Инициализация драйвера
driver = Driver(uc=True, headless=True)

# Открытие переданной ссылки
driver.uc_open_with_reconnect(url, reconnect_time=6)

try:
    # Ждем загрузки таблицы (увеличьте время ожидания, если нужно)
    table_element = WebDriverWait(driver, 60).until(
        EC.presence_of_element_located((By.CLASS_NAME, "ds-dex-table.ds-dex-table-top"))
    )

    # Находим все ссылки
    links = table_element.find_elements(By.TAG_NAME, 'a')

    # Извлекаем href атрибуты
    urls = [link.get_attribute('href') for link in links]

finally:
    # Закрываем драйвер
    driver.quit()

# Удаляем дубликаты из списка токенов
unique_urls = list(set(urls))

# Печатаем уникальные токены в stdout (вывод)
print(json.dumps(unique_urls))

# Завершение работы скрипта
sys.exit(0)
