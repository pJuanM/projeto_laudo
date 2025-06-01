from flask import Flask, render_template, request, make_response
from weasyprint import HTML
from datetime import datetime
import locale
import json

locale.setlocale(locale.LC_TIME, "pt_BR.UTF-8")
data_atual = datetime.now()
dia_atual = data_atual.day
dia_atual = str(dia_atual)
if len(dia_atual) <= 1:
    dia_atual = f'0{dia_atual}'
nome_mes = data_atual.strftime("%B").capitalize()
ano_atual = data_atual.year

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/generate_pdf', methods=['POST'])
def generate_pdf():
    servicos_lista = []

    # Capturar serviços enviados pelo formulário
    servicos_str = request.form.get("servicos", "[]")
    servicos_lista = json.loads(servicos_str)  # Converter JSON para lista Python

    # Outros dados do formulário
    dados = {
        "solicitante": request.form.get('solicitante', ''),
        "laudo": request.form.get('tipo-laudo', ''),
        "equipamento": request.form.get('equipamento', ''),
        "marca": request.form.get('marca', ''),
        "modelo": request.form.get('modelo', ''),
        "patrimonio": request.form.get('patrimonio', ''),
        "diagnostico": request.form.get('diagnostico', ''),
        "conclusao": request.form.get('conclusao', ''),
        "ms": request.form.get('n-ms', ''),
        "sn": request.form.get('sn', ''),
        "servicos": json.loads(request.form.get("servicos", "[]")),
        "dia": dia_atual,
        "mes": nome_mes,
        "ano": ano_atual
    }
    dados_filtrados = {chave: valor for chave, valor in dados.items() if valor and chave != "equipamento"}
    # Renderizar HTML com serviços incluídos
    html = render_template('pdf_template.html', **dados_filtrados)

    import os
    # Converter caminho relativo das imagens para absoluto
    html = html.replace("../static/img/logo_moura.webp", os.path.join(app.root_path, "static/img/logo_moura.webp"))

    # Gerar PDF
    pdf = HTML(string=html, base_url=request.url_root).write_pdf(stylesheets=["static/pdf_style.css"])

    # Retornar PDF como resposta
    response = make_response(pdf)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = f'attachment; filename={dados["equipamento"]}.pdf'
    return response



@app.route('/preview', methods=['GET','POST'])
def preview():
    servicos_lista = json.loads(request.form.get("servicos", "[]"))

    solicitante = request.form.get('solicitante', 'Não informado')
    laudo = request.form.get('tipo-laudo', 'Não informado')
    equipamento = request.form.get('equipamento', 'Não informado')
    marca = request.form.get('marca', 'Não informado')
    modelo = request.form.get('modelo', 'Não informado')
    patrimonio = request.form.get('patrimonio', 'Não informado')
    ms = request.form.get('n-ms', 'Não informado')
    sn = request.form.get('sn', 'Não informado')

    return render_template('pdf_template.html', 
                           solicitante=solicitante,
                           laudo=laudo,
                           equipamento=equipamento,
                           marca=marca,
                           modelo=modelo,
                           patrimonio=patrimonio,
                           ms=ms,
                           sn=sn,
                           servicos=servicos_lista)


if __name__ == '__main__':
    app.run(debug=True)
