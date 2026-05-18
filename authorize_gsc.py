#!/usr/bin/env python3
"""
Первичная авторизация Google Search Console.
Запускается ОДИН РАЗ перед первым docker-compose up.
Результат сохраняется в ./credentials/authorizedcreds.dat
"""

import os
import sys
import argparse

def main():
    creds_path = os.path.join(os.path.dirname(__file__), 'credentials', 'client_secret.json')
    authorized_path = os.path.join(os.path.dirname(__file__), 'credentials', 'authorizedcreds.dat')

    if not os.path.exists(creds_path):
        print(f"\n❌ Файл не найден: {creds_path}")
        print("   Положи client_secret.json в папку ./credentials/ и запусти снова.\n")
        sys.exit(1)

    print("\n🔑 Начинаем авторизацию Google Search Console...")
    print("   Сейчас откроется браузер. Войди в аккаунт Google и разреши доступ.\n")

    try:
        import httplib2
        from apiclient.discovery import build
        from oauth2client import client, file, tools

        SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']

        parser = argparse.ArgumentParser(
            formatter_class=argparse.RawDescriptionHelpFormatter,
            parents=[tools.argparser])
        flags = parser.parse_args([])

        flow = client.flow_from_clientsecrets(
            creds_path, scope=SCOPES,
            message=tools.message_if_missing(creds_path))

        storage = file.Storage(authorized_path)
        credentials = storage.get()

        if credentials is None or credentials.invalid:
            credentials = tools.run_flow(flow, storage, flags)

        # Проверяем что всё работает
        http = httplib2.Http()
        http = credentials.authorize(http=http)
        service = build('searchconsole', 'v1', http=http)
        site_list = service.sites().list().execute()
        sites = [s['siteUrl'] for s in site_list.get('siteEntry', [])
                 if s['permissionLevel'] != 'siteUnverifiedUser']

        print(f"\n✅ Авторизация прошла успешно!")
        print(f"   Токен сохранён: {authorized_path}")
        print(f"   Найдено сайтов в GSC: {len(sites)}")
        for site in sites:
            print(f"   → {site}")
        print("\n   Теперь запускай: docker-compose up --build\n")

    except ImportError as e:
        print(f"\n❌ Не хватает зависимостей: {e}")
        print("   Установи: pip3 install google-api-python-client oauth2client httplib2\n")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Ошибка авторизации: {e}\n")
        sys.exit(1)

if __name__ == '__main__':
    main()
