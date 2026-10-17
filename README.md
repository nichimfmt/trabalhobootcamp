# Pokédex + Supabase - Bootcamp II (Etapa 02)

Aplicação web da Pokédex integrada ao Supabase para persistência de dados e empacotada em container Docker com servidor Nginx.

---

## 🔗 Links do Projeto

* **Repositório no GitHub:** https://github.com/nichimfmt/trabalhobootcamp
* **Aplicação no GitHub Pages:** https://nichimfmt.github.io/trabalhobootcamp/
* **Repositório no Docker Hub:** https://hub.docker.com/r/nickolasfmt/pokedex-bootcamp

---

## 🐳 Como Executar a Aplicação (Docker)

Para executar a imagem oficial diretamente do Docker Hub em qualquer máquina limpa, rode o comando no terminal:

```bash
docker run -d -p 8080:80 nickolasfmt/pokedex-bootcamp:latest

# Após executar o comando acima, acesse no navegador: http://localhost:8080
