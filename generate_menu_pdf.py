# -*- coding: utf-8 -*-
"""
メニュー表PDF生成スクリプト
旬食工房きよし
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
import os
from menu_data import MENU_DATA

class MenuPDFGenerator:
    """メニュー表PDF生成クラス"""

    def __init__(self, output_path):
        self.output_path = output_path
        self.doc = SimpleDocTemplate(
            output_path,
            pagesize=A4,
            rightMargin=20*mm,
            leftMargin=20*mm,
            topMargin=20*mm,
            bottomMargin=20*mm
        )
        self.story = []
        self.base_styles = getSampleStyleSheet()
        self.styles = getSampleStyleSheet()
        self.setup_fonts()
        self.setup_styles()

    def setup_fonts(self):
        """日本語フォントの設定"""
        # Windowsの日本語フォントを使用
        font_paths = [
            "C:/Windows/Fonts/msmincho.ttc",  # MS明朝
            "C:/Windows/Fonts/msgothic.ttc",  # MSゴシック
            "C:/Windows/Fonts/yumin.ttf",     # 游明朝
            "C:/Windows/Fonts/yugothic.ttf",  # 游ゴシック
        ]

        # 利用可能なフォントを探す
        for font_path in font_paths:
            if os.path.exists(font_path):
                try:
                    # MS明朝/MSゴシックはTTCファイルなので、サブフォントを指定
                    if "ttc" in font_path:
                        pdfmetrics.registerFont(TTFont('Japanese', font_path, subfontIndex=0))
                        pdfmetrics.registerFont(TTFont('Japanese-Bold', font_path, subfontIndex=1))
                    else:
                        pdfmetrics.registerFont(TTFont('Japanese', font_path))
                        pdfmetrics.registerFont(TTFont('Japanese-Bold', font_path))

                    print(f"フォントを読み込みました: {font_path}")
                    break
                except Exception as e:
                    print(f"フォント読み込みエラー: {e}")
                    continue

    def setup_styles(self):
        """スタイルの設定"""
        # カスタムスタイル名を使用（競合を避けるため）
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontName='Japanese-Bold',
            fontSize=24,
            textColor=colors.HexColor('#8b4513'),
            alignment=TA_CENTER,
            spaceAfter=10*mm
        ))

        self.styles.add(ParagraphStyle(
            name='CustomSubtitle',
            parent=self.styles['Normal'],
            fontName='Japanese',
            fontSize=14,
            textColor=colors.HexColor('#8b4513'),
            alignment=TA_CENTER,
            spaceAfter=5*mm
        ))

        self.styles.add(ParagraphStyle(
            name='CustomSectionTitle',
            parent=self.styles['Heading2'],
            fontName='Japanese-Bold',
            fontSize=18,
            textColor=colors.HexColor('#8b4513'),
            spaceBefore=8*mm,
            spaceAfter=5*mm
        ))

        self.styles.add(ParagraphStyle(
            name='CustomMenuName',
            parent=self.styles['Normal'],
            fontName='Japanese-Bold',
            fontSize=13,
            textColor=colors.HexColor('#2c1810'),
            spaceAfter=2*mm
        ))

        self.styles.add(ParagraphStyle(
            name='CustomMenuDescription',
            parent=self.styles['Normal'],
            fontName='Japanese',
            fontSize=9,
            textColor=colors.Color(0.3, 0.3, 0.3, 1),
            spaceAfter=3*mm
        ))

        self.styles.add(ParagraphStyle(
            name='CustomPrice',
            parent=self.styles['Normal'],
            fontName='Japanese-Bold',
            fontSize=13,
            textColor=colors.HexColor('#dc143c'),
            alignment=TA_RIGHT
        ))

        self.styles.add(ParagraphStyle(
            name='CustomNote',
            parent=self.styles['Normal'],
            fontName='Japanese',
            fontSize=9,
            textColor=colors.Color(0.5, 0.5, 0.5, 1),
            alignment=TA_CENTER
        ))

    def add_header(self):
        """ヘッダーの追加"""
        # 店名
        title = Paragraph(MENU_DATA["restaurant"]["name_ja"], self.styles['CustomTitle'])
        self.story.append(title)

        # 英文店名
        subtitle = Paragraph(MENU_DATA["restaurant"]["name_en"], self.styles['CustomSubtitle'])
        self.story.append(subtitle)

        # スローガン
        slogan = Paragraph(f"〜 {MENU_DATA['restaurant']['location']} 〜<br/>{MENU_DATA['restaurant']['slogan']}", self.styles['CustomSubtitle'])
        self.story.append(slogan)

        # 区切り線
        self.story.append(Spacer(1, 5*mm))
        line_data = [['━' * 50]]
        line_table = Table(line_data, colWidths=[170*mm])
        line_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, 0), 'CENTER'),
            ('TEXTCOLOR', (0, 0), (0, 0), colors.HexColor('#d4af37')),
        ]))
        self.story.append(line_table)
        self.story.append(Spacer(1, 5*mm))

    def add_signature_menu(self):
        """看板メニューの追加"""
        section_title = Paragraph("★★★ 看板メニュー ★★★", self.styles['CustomSectionTitle'])
        self.story.append(section_title)

        menu = MENU_DATA["signature_menu"]

        # メニュー名
        name = Paragraph(f"{menu['name']}<br/>{menu['name_en']}", self.styles['CustomMenuName'])
        self.story.append(name)

        # 説明
        description = Paragraph(menu['description'], self.styles['CustomMenuDescription'])
        self.story.append(description)

        # 価格
        price = Paragraph(f"¥{menu['price']:,}（税込¥{int(menu['price'] * 1.1):,}）", self.styles['CustomPrice'])
        self.story.append(price)

        self.story.append(Spacer(1, 5*mm))

        # 区切り線
        line_data = [['━' * 50]]
        line_table = Table(line_data, colWidths=[170*mm])
        line_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, 0), 'CENTER'),
            ('TEXTCOLOR', (0, 0), (0, 0), colors.HexColor('#d4af37')),
        ]))
        self.story.append(line_table)
        self.story.append(Spacer(1, 5*mm))

    def add_regular_menus(self):
        """定番メニューの追加"""
        section_title = Paragraph("【 定食・御膳 】", self.styles['CustomSectionTitle'])
        self.story.append(section_title)

        for menu in MENU_DATA["regular_menus"]:
            # メニューテーブル
            menu_data = [
                [Paragraph(menu['name'], self.styles['CustomMenuName']),
                 Paragraph(f"¥{menu['price']:,}", self.styles['CustomPrice'])],
                [Paragraph(menu['description'], self.styles['CustomMenuDescription']), ''],
                ['', ''],  # 空白行
            ]

            menu_table = Table(menu_data, colWidths=[130*mm, 40*mm])
            menu_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (0, 0), 'LEFT'),
                ('ALIGN', (0, 1), (0, 1), 'LEFT'),
                ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('BOTTOMPADDING', (0, 1), (0, 1), 3*mm),
            ]))
            self.story.append(menu_table)

        # 注意書き
        note = Paragraph(MENU_DATA["note"], self.styles['CustomNote'])
        self.story.append(note)
        self.story.append(Spacer(1, 3*mm))

    def add_special_sets(self):
        """特別セットの追加"""
        section_title = Paragraph("【 飲張りセット 】", self.styles['CustomSectionTitle'])
        self.story.append(section_title)

        for menu in MENU_DATA["special_sets"]:
            menu_data = [
                [Paragraph(menu['name'], self.styles['CustomMenuName']),
                 Paragraph(f"¥{menu['price']:,}", self.styles['CustomPrice'])],
                [Paragraph(menu['description'], self.styles['CustomMenuDescription']), ''],
                ['', ''],
            ]

            menu_table = Table(menu_data, colWidths=[130*mm, 40*mm])
            menu_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (0, 0), 'LEFT'),
                ('ALIGN', (0, 1), (0, 1), 'LEFT'),
                ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('BOTTOMPADDING', (0, 1), (0, 1), 3*mm),
            ]))
            self.story.append(menu_table)

        self.story.append(Spacer(1, 3*mm))

    def add_sushi_menus(self):
        """寿司・刺身の追加"""
        section_title = Paragraph("【 寿司・刺身 】", self.styles['CustomSectionTitle'])
        self.story.append(section_title)

        for menu in MENU_DATA["sushi_menus"]:
            menu_data = [
                [Paragraph(menu['name'], self.styles['CustomMenuName']),
                 Paragraph(f"¥{menu['price']:,}", self.styles['CustomPrice'])],
                [Paragraph(menu['description'], self.styles['CustomMenuDescription']), ''],
                ['', ''],
            ]

            menu_table = Table(menu_data, colWidths=[130*mm, 40*mm])
            menu_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (0, 0), 'LEFT'),
                ('ALIGN', (0, 1), (0, 1), 'LEFT'),
                ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('BOTTOMPADDING', (0, 1), (0, 1), 3*mm),
            ]))
            self.story.append(menu_table)

        self.story.append(Spacer(1, 3*mm))

    def add_don_menus(self):
        """丼ものの追加"""
        section_title = Paragraph("【 丼もの 】", self.styles['CustomSectionTitle'])
        self.story.append(section_title)

        for menu in MENU_DATA["don_menus"]:
            menu_data = [
                [Paragraph(menu['name'], self.styles['CustomMenuName']),
                 Paragraph(f"¥{menu['price']:,}", self.styles['CustomPrice'])],
                [Paragraph(menu['description'], self.styles['CustomMenuDescription']), ''],
                ['', ''],
            ]

            menu_table = Table(menu_data, colWidths=[130*mm, 40*mm])
            menu_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (0, 0), 'LEFT'),
                ('ALIGN', (0, 1), (0, 1), 'LEFT'),
                ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('BOTTOMPADDING', (0, 1), (0, 1), 3*mm),
            ]))
            self.story.append(menu_table)

        self.story.append(Spacer(1, 3*mm))

    def add_udon_sets(self):
        """うどんセットの追加"""
        section_title = Paragraph("【 うどんセット 】", self.styles['CustomSectionTitle'])
        self.story.append(section_title)

        for menu in MENU_DATA["udon_sets"]:
            menu_data = [
                [Paragraph(menu['name'], self.styles['CustomMenuName']),
                 Paragraph(f"¥{menu['price']:,}", self.styles['CustomPrice'])],
                [Paragraph(menu['description'], self.styles['CustomMenuDescription']), ''],
                ['', ''],
            ]

            menu_table = Table(menu_data, colWidths=[130*mm, 40*mm])
            menu_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (0, 0), 'LEFT'),
                ('ALIGN', (0, 1), (0, 1), 'LEFT'),
                ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('BOTTOMPADDING', (0, 1), (0, 1), 3*mm),
            ]))
            self.story.append(menu_table)

        self.story.append(Spacer(1, 3*mm))

    def add_footer(self):
        """フッターの追加"""
        # 区切り線
        line_data = [['━' * 50]]
        line_table = Table(line_data, colWidths=[170*mm])
        line_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, 0), 'CENTER'),
            ('TEXTCOLOR', (0, 0), (0, 0), colors.HexColor('#d4af37')),
        ]))
        self.story.append(line_table)
        self.story.append(Spacer(1, 5*mm))

        # 営業案内
        info_text = f"""
        <b>【 営業案内 】</b><br/>
        営業時間: {MENU_DATA['restaurant']['hours']}<br/>
        定休日: {MENU_DATA['restaurant']['closed']}<br/>
        ご予約承ります<br/><br/>
        <b>【 お問い合わせ 】</b><br/>
        TEL: {MENU_DATA['restaurant']['phone']}<br/>
        住所: {MENU_DATA['restaurant']['address']}
        """

        info = Paragraph(info_text, self.styles['CustomMenuDescription'])
        self.story.append(info)

        # 注意書き
        note = Paragraph(MENU_DATA["footer_note"], self.styles['CustomNote'])
        self.story.append(note)
        self.story.append(Spacer(1, 5*mm))

        # 最後の区切り線
        line_data = [['━' * 50]]
        line_table = Table(line_data, colWidths=[170*mm])
        line_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, 0), 'CENTER'),
            ('TEXTCOLOR', (0, 0), (0, 0), colors.HexColor('#d4af37')),
        ]))
        self.story.append(line_table)
        self.story.append(Spacer(1, 5*mm))

        # 店名とスローガン
        footer = Paragraph(f"{MENU_DATA['restaurant']['name_ja']}<br/>{MENU_DATA['restaurant']['slogan']}", self.styles['CustomTitle'])
        self.story.append(footer)

    def generate(self):
        """PDFの生成"""
        print("メニュー表PDFを生成します...")

        # 各セクションを追加
        self.add_header()
        self.add_signature_menu()
        self.add_regular_menus()
        self.story.append(PageBreak())  # 改ページ
        self.add_special_sets()
        self.add_sushi_menus()
        self.add_don_menus()
        self.add_udon_sets()
        self.story.append(PageBreak())  # 改ページ
        self.add_footer()

        # PDFをビルド
        try:
            self.doc.build(self.story)
            print(f"[OK] PDFを生成しました: {self.output_path}")
            return True
        except Exception as e:
            print(f"[ERROR] PDF生成エラー: {e}")
            return False

def main():
    """メイン関数"""
    output_path = "kioshi-restaurant-menu.pdf"
    generator = MenuPDFGenerator(output_path)
    success = generator.generate()

    if success:
        print("\n[SUCCESS] メニュー表のPDFが完成しました！")
        print(f"[FILE] ファイル: {output_path}")
        print(f"[PRINT] 印刷してそのままお使いいただけます")
    else:
        print("\n[FAILED] PDFの生成に失敗しました...")

if __name__ == "__main__":
    main()
