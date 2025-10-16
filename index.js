'use strict'

var port = 9932

const express = require('express')
const bodyparser = require('body-parser')
const app = express()

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
  extended: true
}))

app.listen(port, () => {
  console.log(`servidor rodando na porta ${port}`)
})

app.post('/bot', (req, res) => {
  switch (req.body.queryResult.action) {
    case 'agendar_exame':
    case 'agendar_consulta':
    case 'dados_consulta': {
      return res.json({
        followupEventInput: {
          name: validarDataAgendamento(req.body.queryResult.parameters['data_consulta']),
          languageCode: "pt-BR",
          source: "from V2"
        }
      })
    }
    case 'dados_exame': {
      return res.json({
        followupEventInput: {
          name: validarDataExame(req.body.queryResult.parameters['data_exame']),
          languageCode: "pt-BR",
          source: "from V2"
        }
      })
    } 
    case 'dados_exame_disponivel': {
      return res.json({
        followupEventInput: {
          name: candidatoValidoExames(req.body.queryResult.parameters['cpf']),
          languageCode: "pt-BR",
          source: "from V2"
        }
      })
    }
    case 'agndamento_recomecar': {
      return res.json({
        followupEventInput: {
          name: validarDataAgendamento(req.body.queryResult.parameters['data_consulta']),
          languageCode: "pt-BR",
          source: "from V2"
        }
      })
    }
  }
})

const validarDataAgendamento = (dataAgendamento) => {
  const mesesInvalidos = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "12"]
  const dataExameDesmontada = dataAgendamento.split("/")
  if (mesesInvalidos.includes(dataExameDesmontada[1])) {
    return "horario_agendamento_invalido"
  }
  return "horario_agendamento_valido"
}

const validarDataExame = (dataExame) => {
  const mesesInvalidos = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "12"]
  const dataExameDesmontada = dataExame.split("/")
  if (mesesInvalidos.includes(dataExameDesmontada[1])) {
    return "horario_exame_invalido"
  }
  return "horario_exame_valido"
}

const candidatoValidoExames = (cpf) => {
  const cpfsAlvo = ["51077902085"]
  return cpfsAlvo.includes(cpf) ? "resultado_exame_invalido" : "resultado_exame_valido" 
}
