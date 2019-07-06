CREATE TABLE public.users
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    first_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    email character varying(40) COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    phone_number character varying(24) COLLATE pg_catalog."default",
    address character varying COLLATE pg_catalog."default",
    image character varying COLLATE pg_catalog."default",
    user_type character varying(8) COLLATE pg_catalog."default",
    is_admin boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_on date DEFAULT CURRENT_DATE,
    reset_password_token character varying COLLATE pg_catalog."default",
    reset_password_expires bigint,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;