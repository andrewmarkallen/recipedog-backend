#!/bin/sh

SSL_CERT=/etc/letsencrypt/live/${CERT_DOMAIN}/fullchain.pem
SSL_CERT_KEY=/etc/letsencrypt/live/${CERT_DOMAIN}/privkey.pem

if [[ ${CLEAR_CERTS} == 1 ]]; then
  echo "Clearing old certificates"

  echo "Attempting to revoke certificates"
  certbot revoke --agree-tos --non-interactive --cert-path "$SSL_CERT" -m "$CERT_EMAIL"

  echo "Deleting certificates"
  certbot delete --cert-name ${CERT_DOMAIN}

  echo "Setting flag for nginx."
  touch /etc/letsencrypt/ready.flag

fi

echo "Testing for existence of certificates at locations:"
echo "$SSL_CERT"
echo "$SSL_CERT_KEY"

# Enable staging mode if needed
if [ $STAGING != "0" ]; then STAGING_FLAG="--staging"; fi

if [[ ! -f $SSL_CERT || ! -f $SSL_CERT_KEY ]]; then
  echo "Certificates not found, invoking certbot"
  certbot certonly ${STAGING_FLAG} --non-interactive --webroot --webroot-path /var/www/certbot/ --agree-tos -m "$CERT_EMAIL" -d "$CERT_DOMAIN"
else
  echo "Certificates present, no certbot action taken"
fi

echo "Starting renewal service"

trap exit TERM
while :; do
  certbot renew
  sleep 12h
done
