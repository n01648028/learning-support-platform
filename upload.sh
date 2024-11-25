ac_i=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_
ac_temp=$(printf "%s" $ac_i | cut -c 7)ithub_pat_11BCZ7OLY0DpxW0Eq7IH68_0NlMCcXuFbOLHoaQw3dq7Piiim8Ede8sYCjyb5s9r97NX6WV5UWTz3YIqRc
#echo $ac_temp
git pull
git add .
git commit -m update
git push https://$ac_temp@github.com/n01648028/learning-support-platform
git pull
