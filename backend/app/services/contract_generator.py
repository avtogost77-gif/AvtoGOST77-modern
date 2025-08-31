"""
Сервис для генерации договоров
"""

import os
from datetime import datetime
from typing import Dict, Any
from jinja2 import Environment, FileSystemLoader
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
import weasyprint
from loguru import logger

from app.models.contract import Contract
from app.models.client import Client


class ContractGenerator:
    """
    Генератор договоров
    """
    
    def __init__(self):
        self.templates_dir = os.path.join(os.path.dirname(__file__), '..', 'templates', 'contracts')
        self.env = Environment(loader=FileSystemLoader(self.templates_dir))
        
    def _number_to_words(self, number: float) -> str:
        """
        Преобразование числа в слова
        """
        units = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять']
        teens = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 
                'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать']
        tens = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 
               'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто']
        hundreds = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 
                   'шестьсот', 'семьсот', 'восемьсот', 'девятьсот']
        
        def convert_less_than_one_thousand(n):
            if n == 0:
                return ""
            elif n < 10:
                return units[n]
            elif n < 20:
                return teens[n - 10]
            elif n < 100:
                return tens[n // 10] + (" " + units[n % 10] if n % 10 != 0 else "")
            else:
                return hundreds[n // 100] + (" " + convert_less_than_one_thousand(n % 100) if n % 100 != 0 else "")
        
        if number == 0:
            return "ноль рублей"
        
        # Разделяем на рубли и копейки
        rubles = int(number)
        kopecks = int((number - rubles) * 100)
        
        # Конвертируем рубли
        if rubles == 0:
            rubles_text = ""
        elif rubles == 1:
            rubles_text = "один рубль"
        elif 2 <= rubles <= 4:
            rubles_text = convert_less_than_one_thousand(rubles) + " рубля"
        else:
            rubles_text = convert_less_than_one_thousand(rubles) + " рублей"
        
        # Конвертируем копейки
        if kopecks == 0:
            kopecks_text = ""
        elif kopecks == 1:
            kopecks_text = "одна копейка"
        elif 2 <= kopecks <= 4:
            kopecks_text = convert_less_than_one_thousand(kopecks) + " копейки"
        else:
            kopecks_text = convert_less_than_one_thousand(kopecks) + " копеек"
        
        # Собираем результат
        result = rubles_text
        if kopecks > 0:
            if result:
                result += " " + kopecks_text
            else:
                result = kopecks_text
        
        return result
    
    def _generate_contract_number(self, contract_id: int) -> str:
        """
        Генерация номера договора
        """
        current_date = datetime.now()
        return f"ДОГ-{current_date.year}-{contract_id:04d}"
    
    def generate_contract_data(self, contract: Contract, client: Client) -> Dict[str, Any]:
        """
        Подготовка данных для шаблона договора
        """
        contract_number = self._generate_contract_number(contract.id)
        contract_date = contract.created_at.strftime("%d.%m.%Y") if contract.created_at else datetime.now().strftime("%d.%m.%Y")
        
        return {
            "contract_number": contract_number,
            "contract_date": contract_date,
            "client_name": client.display_name,
            "client_inn": client.inn,
            "client_address": client.address,
            "client_phone": client.phone,
            "client_email": client.email,
            "route_from": contract.route_from,
            "route_to": contract.route_to,
            "cargo_description": contract.cargo_description or "Не указано",
            "cargo_weight": contract.cargo_weight or 0,
            "cargo_volume": contract.cargo_volume,
            "delivery_time": contract.delivery_time or "По согласованию",
            "is_urgent": contract.is_urgent,
            "is_consolidated": contract.is_consolidated,
            "total_amount": f"{contract.total_amount:,.0f}" if contract.total_amount else "0",
            "amount_in_words": self._number_to_words(float(contract.total_amount) if contract.total_amount else 0)
        }
    
    def generate_html_contract(self, contract: Contract, client: Client, template_name: str = "client_template.html") -> str:
        """
        Генерация HTML договора
        """
        try:
            template = self.env.get_template(template_name)
            data = self.generate_contract_data(contract, client)
            html_content = template.render(**data)
            return html_content
        except Exception as e:
            logger.error(f"Ошибка генерации HTML договора: {e}")
            raise
    
    def generate_pdf_contract(self, contract: Contract, client: Client, template_name: str = "client_template.html") -> bytes:
        """
        Генерация PDF договора
        """
        try:
            html_content = self.generate_html_contract(contract, client, template_name)
            
            # Конвертируем HTML в PDF
            pdf_content = weasyprint.HTML(string=html_content).write_pdf()
            return pdf_content
        except Exception as e:
            logger.error(f"Ошибка генерации PDF договора: {e}")
            raise
    
    def save_contract_pdf(self, contract: Contract, client: Client, file_path: str, template_name: str = "client_template.html") -> str:
        """
        Сохранение договора в PDF файл
        """
        try:
            pdf_content = self.generate_pdf_contract(contract, client, template_name)
            
            with open(file_path, 'wb') as f:
                f.write(pdf_content)
            
            logger.info(f"Договор сохранен: {file_path}")
            return file_path
        except Exception as e:
            logger.error(f"Ошибка сохранения договора: {e}")
            raise


# Создание экземпляра генератора
contract_generator = ContractGenerator()
