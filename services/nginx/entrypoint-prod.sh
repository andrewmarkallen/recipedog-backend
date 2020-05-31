#!/bin/bash

service nginx start
# nginx -g "daemon off;" &
PROC_ID=$!
echo "nginx running in process ${PROC_ID}"

echo "Waiting for certificates..."

SSL_CERT=/etc/letsencrypt/live/${CERT_DOMAIN}/fullchain.pem
SSL_CERT_KEY=/etc/letsencrypt/live/${CERT_DOMAIN}/privkey.pem


if [ ${CLEAR_CERTS} = 1 ]; then
  while [ ! -f /etc/letsencrypt/ready.flag ]; do
    echo "waiting for certbot to remove old certificates"
    sleep 5
  done
fi

"removing ready flag"
rm /etc/letsencrypt/ready.flag

## Loop until these files are created

while [ ! -f $SSL_CERT ] ; do
  echo "Waiting for certificates..."
  sleep 2
done

echo "...certificates present."

# switch to ssl
echo "Switching to SSL by swapping nginx configuration files."
rm /etc/nginx/conf.d/prod_http.conf
cp /var/run/nginx/stage.conf /etc/nginx/conf.d

trap exit TERM
while :; do
  echo "Restarting nginx..."
  service nginx restart
  echo "...nginx restarted, sleeping 6 hours."
  sleep 6h
done
