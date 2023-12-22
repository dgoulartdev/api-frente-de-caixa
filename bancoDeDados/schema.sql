drop database if exists pdv;

create database pdv;

create table usuarios (
    id serial primary key,
    nome text not null,
    email text not null unique,
    senha text not null
);

create table categorias (
    id serial primary key,
    descricao text not null
);

insert into categorias
(descricao)
values
('Informática'),
('Celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livros e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games');

create table produtos (
    id serial primary key,
    descricao text,
    quantidade_estoque int,
    valor int not null,
    categoria_id int references categorias(id)
);

create table clientes (
    id serial primary key,
    nome text not null,
    email text unique not null,
    cpf varchar(11) unique not null,
    cep varchar(8),
    rua text,
    numero text,
    bairro text,
    cidade text,
    estado text
);

create table pedidos (
	id serial primary key,
  cliente_id integer references clientes(id),
  observacao text,
  valor_total integer not null
);

create table pedido_produtos (
	id serial primary key,
  pedido_id integer references pedidos(id),
  produto_id integer references produtos(id),
  quantidade_produto integer,
  valor_produto integer
);

alter table produtos add column produto_imagem text