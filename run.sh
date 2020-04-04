cd /volume1/web/umami-app
source umami-app/bin/activate
gunicorn --certfile /usr/syno/etc/certificate/system/default/cert.pem --keyfile /usr/syno/etc/certificate/system/default/privkey.pem -b 127.0.0.1:8001 backend.wsgi:application --daemon
