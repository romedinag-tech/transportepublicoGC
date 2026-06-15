"""Mapa unidad/linea -> empresa operadora (nombres desde fuentes publicas:
Wikipedia 'Buses licitados del Gran Concepción'). RUT proviene de los datos GPS.
Genera dashboard/data/empresas.json y carga la tabla transporte_gccp.empresas.
"""
import os, json, csv, tempfile, subprocess
from config import GCP_PROJECT, GCP_LOCATION, BQ_DATASET

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "dashboard", "data")
os.makedirs(OUT, exist_ok=True)

# unidad: (linea, rut_operador(de los datos), razon_social, fantasia, comunas)
E = {
 "UN02_281": ("02","96709130","Transportes Hualpensan S.A.","Buses Hualpensan","Talcahuano-Hualpén"),
 "UN10_280": ("10","96627540","Servicio de locomoción colectiva Vía Láctea S.A.","Vía Láctea","Chiguayante-Concepción-Talcahuano"),
 "UN11_279": ("11","96689320","Sociedad de transportes Vía Futuro S.A.","Vía Futuro","Chiguayante-Concepción-Talcahuano"),
 "UN12_249": ("12","96971790","Sociedad de transportes Nueva Sotrapel S.A.","Nueva Sotrapel","Chiguayante-Concepción-Hualpén-Talcahuano"),
 "UN13_247": ("13","96770880","Transportes Vía Siglo XXI S.A.","Vía Siglo XXI","Chiguayante-Concepción-Talcahuano"),
 "UN14_278": ("14","96686700","Soc. de transportes públicos de pasajeros Chiguayante Sur S.A.","Chiguayante Sur","Chiguayante-Concepción-Talcahuano"),
 "UN16_252": ("16","96890370","Transportes Vía Universo S.A.","Vía Universo","Concepción-Talcahuano"),
 "UN17_253": ("17","96717040","Expresos Plaza del Mall S.A.","Expresos Chiguayante","Chiguayante-Concepción"),
 "UN18_254": ("18","96717360","Soc. de Buses Expreso Concepción-Chiguayante S.A.","Buses Palomares","Chiguayante-Concepción"),
 "UN20_255": ("20","96899680","Comercializadora y serv. de loc. colectiva Nueva Llacolén S.A.","Nueva Llacolén","San Pedro de la Paz-Concepción-Talcahuano"),
 "UN21_256": ("21","77108750","Sociedad Riviera Ltda.","Riviera Bio Bío","San Pedro de la Paz-Concepción"),
 "UN22_257": ("22","96708480","Comercializadora y serv. de loc. colectiva San Pedro S.A.","San Pedro","San Pedro de la Paz-Concepción"),
 "UN23_258": ("23","96662090","Comercial San Pedro Sur S.A.","Buses San Pedro del Mar","San Pedro de la Paz-Concepción"),
 "UN24_259": ("24","96630800","Servicio locomoción colectiva San Remo S.A.","San Remo","San Pedro de la Paz-Concepción"),
 "UN30_260": ("30","96776830","Transporte público de pasajeros Ruta Las Playas S.A.","Ruta Las Playas","Penco-Concepción-Hualpén-Talcahuano"),
 "UN31_284": ("31","76444992","Transportes y servicios Ruta del Mar S.A.","Ruta del Mar","Penco-Concepción"),
 "UN32_285": ("32","79622800","Sociedad comercial inmobiliaria Del Mar Ltda.","Buses Ruta del Mar","Penco-Concepción"),
 "UN40_261": ("40","96620790","Servicio de locomoción colectiva Las Golondrinas S.A.","Las Golondrinas","Concepción-Hualpén-Talcahuano"),
 "UN41_262": ("41","77784672","Servicios de movilización colectiva Mini Verde Ltda.","Buses Mini Verde","Concepción-Hualpén"),
 "UN42_263": ("42","96623790","Servicio de loc. colectiva Mini Buses Hualpencillo S.A.","Mini Buses Hualpencillo","Concepción-Hualpén-Talcahuano"),
 "UN43_250": ("43","78768420","Centauro Repuestos Ltda.","Flota Las Lilas","Concepción-Talcahuano"),
 "UN44_264": ("44","79601540","Comercial Centauro Ltda.","Flota Centauro","Concepción-Talcahuano"),
 "UN50_286": ("50","96776830","Sociedad de transportes Ruta Las Playas Campanil S.A.","Buses Campanil","Penco-Concepción-Talcahuano"),
 "UN52_265": ("52","78578510","Servicios de locomoción colectiva Géminis Sur Ltda.","Géminis Sur","Concepción-Talcahuano"),
 "UN56_266": ("56","77715130","Sociedad de transportes Buses Base Naval Ltda.","Buses Base Naval","Concepción-Talcahuano"),
 "UN60_268": ("60","96696310","Transportes de pasajeros Buses Tucapel S.A.","Buses Tucapel","Concepción-Hualpén"),
 "UN62_269": ("62","96896040","Buses Primavera S.A.","Mi Expreso","Concepción-Hualpén"),
 "UN63_270": ("63","77773306","Empresa de transportes Rengo Lientur Ltda.","Rengo Lientur","Concepción-Talcahuano"),
 "UN65_271": ("65","77780773","Sociedad de transportes Cóndor S.A.","Buses Cóndor","Concepción-Talcahuano"),
 "UN70_272": ("70","96875900","Transporte y administración Las Bahías S.A.","Las Bahías","Concepción-Hualpén-Talcahuano"),
 "UN71_273": ("71","96640240","Servicio de locomoción colectiva Puchacay S.A.","Buses Puchacay","Penco-Concepción"),
 "UN72_248": ("72","96623970","Serv. de loc. colectiva y comercial Pedro de Valdivia Universidad S.A.","Pedro de Valdivia","Concepción-Talcahuano"),
 "UN80_274": ("80","85902200","Sociedad Ruta Las Galaxias S.A.","Las Galaxias","Hualqui-Chiguayante-Concepción-Talcahuano"),
 "UN81_275": ("81","96873710","Soc. de transportes e inversiones Vía del Sol S.A.","Vía del Sol","Concepción-Talcahuano"),
 "UN90_276": ("90","96722920","Soc. comercial de servicios y transportes Nueva Sol Yet S.A.","Nueva Sol Yet","Concepción-Talcahuano"),
 "UNB0_277": ("B0","76478120","Servicio de transporte intermodal S.A.","Bio Bus","Intermodal Gran Concepción"),
}

rows = [{"unidad":u,"linea":v[0],"operador_rut":v[1],"razon_social":v[2],
         "fantasia":v[3],"comunas":v[4]} for u,v in sorted(E.items())]

with open(os.path.join(OUT,"empresas.json"),"w",encoding="utf-8") as f:
    json.dump(rows, f, ensure_ascii=False, indent=1)
print("empresas.json:", len(rows), "unidades")

# cargar a BigQuery
tmp = os.path.join(tempfile.gettempdir(), "empresas.csv")
with open(tmp,"w",encoding="utf-8",newline="") as f:
    w = csv.DictWriter(f, fieldnames=["unidad","linea","operador_rut","razon_social","fantasia","comunas"])
    w.writeheader(); w.writerows(rows)

tbl = f"{GCP_PROJECT}:{BQ_DATASET}.empresas"
subprocess.run(["bq","load","--replace","--source_format=CSV","--skip_leading_rows=1",
    "--schema=unidad:STRING,linea:STRING,operador_rut:STRING,razon_social:STRING,fantasia:STRING,comunas:STRING",
    tbl, tmp], check=True, shell=True)
print("Tabla BigQuery cargada:", tbl)
