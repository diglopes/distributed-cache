# Conceito de Cache
Cache é uma camada de armazenamento de dados temporários, usada para melhorar o desempenho de sistemas computacionais. Ele atua armazenando os dados frequentemente acessados ou mais recentemente utilizados em um local de acesso rápido (como memória RAM ou disco local), reduzindo o tempo necessário para recuperar informações de um recurso mais lento, como um banco de dados ou uma API externa. O cache é amplamente utilizado em aplicações web, bancos de dados, sistemas distribuídos, entre outros, e pode ser implementado em várias camadas:

- **Cache no cliente:** Dados armazenados localmente no navegador, como cookies ou local storage.
- **Cache no servidor:** Implementado em servidores para armazenar respostas frequentes ou resultados de cálculos.
- **Cache distribuído:** Usado em sistemas com múltiplos servidores ou instâncias, onde os dados do cache são compartilhados entre todos os nós.

# Rodando

Inicialize os nós do Redis e a aplicação de exemplo com o docker compose:

```bash
docker compose up
```

Com o comando abaixo crie um cluster contendo **3 nós mestres** e **3 nós réplicas** (6 nós totais), valor mínimo necessário para que o mecanismo de reatribuição de nó mestre precisa para funcionar adequadamente e designar um novo nó mestre caso por algum motivo um dos 3 pare de responder.

```bash
docker exec -it redis-node1 redis-cli --cluster create \
  redis-node1:6379 redis-node2:6379 redis-node3:6379 \
  redis-node4:6379 redis-node5:6379 redis-node6:6379 \
  --cluster-replicas 1
```

Desta forma, os 16383 **hash slots** ficariam distribuídos da seguinte maneira:

```yaml
Mestre 1 → Slots 0 - 5460
Mestre 2 → Slots 5461 - 10922
Mestre 3 → Slots 10923 - 16383
```

Para verificar qual **hash slot** será utilizado para salvar o dado, consequentemente, 
à qual mestre será distribuído basta utilizar o comando abaixo:
```bash
docker exec -it redis-node1 redis-cli cluster keyslot key:data
```

Ou se quiser ver em tempo real as solicitações que estão sendo direcionadas para um determinado nó (ex: redis-node1) basta rodar este comando:
```bash
docker exec -it redis-node1 redis-cli monitor
```

## Criando chaves pelas consultas

Faça solicitações para a API criada e veja os resultados sendo retornados por meio de cache ou "consulta direta".

```yml
GET http://localhost:3000/data
```

Caso queira mudar a chave em que os dados são salvos, basta enviar o `query param`
`cacheKey` com o valor desejado, como no exemplo abaixo:

```yml
GET http://localhost:3000/data?cacheKey=key:data90
```

Neste caso, ao invés de utilizar a chave padrão `key:data` será utilizado a chave `key:data90` provida.