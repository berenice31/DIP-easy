Table "public.product_info"
Column | Type | Collation | Nullable | Default
------------------+-------------------+-----------+----------+------------------------------------------  
 id | integer | | not null | nextval('product_info_id_seq'::regclass)  
 nom_commercial | character varying | | not null |
ref_formule | character varying | | |
ref_produit | character varying | | not null |
date_mise_marche | date | | |
resp_mise_marche | character varying | | |
faconnerie | character varying | | |
:...skipping...
PS C:\Users\FX706\Documents\DEV\dip-easy\DIP-easy\backend> docker exec -it cb9b21212eaf psql -U postgres -d d docker exec -it cb9b21212eaf psql -U postgres -d dip_easy -c "\d user"
Table "public.user"
Column | Type | Collation | Nullable | Default
------------------+-----------------------------+-----------+----------+----------------------------------  
 id | integer | | not null | nextval('user_id_seq'::regclass)  
 Table "public.user"
Column | Type | Collation | Nullable | Default
------------------+-----------------------------+-----------+----------+----------------------------------  
 id | integer | | not null | nextval('user_id_seq'::regclass)  
 email | character varying | | not null |
password | character varying | | not null |
twoFactorEnabled | boolean | | not null | false
twoFactorSecret | character varying | | |
