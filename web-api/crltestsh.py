import requests
import os
import json

os.system('clear')

with open("out.txt", "a+") as out_file:
	out_file.truncate(len(out_file.read()))

	class tcols:
	        HEADER = "\033[95m"
	        BLUE = "\033[94m"
	        SUCCESS = "\033[92m"
	        FAIL = "\033[91m"
	        WARNING = "\033[93m"
	        ENDC = "\033[0m"
	        UNDERLINE = "\033[04m"

	kvreq = {
		'GET_CURR_AA': [
			'http://localhost:8080/Esse3RestApi/rest/anno_accademico_corrente/tipo_data_rif_cod/DR_CALESA',
			'http://localhost:8080/Esse3RestApi/rest/anno_accademico_corrente/tipo_data_rif_cod/DR_CALESA/?tipo_corso_cod=L2',
		],	
		'AA_LOOKUP': [
			'http://localhost:8080/Esse3RestApi/rest/elenco_anni_accademici/aa_ini_id/2005',
		],
		'CLASSI': [
			'http://localhost:8080/Esse3RestApi/rest/classi',
			'http://localhost:8080/Esse3RestApi/rest/classi/?cla_m_id=1',
		],
		'FACOLTA': [
			'http://localhost:8080/Esse3RestApi/rest/facolta',
			'http://localhost:8080/Esse3RestApi/rest/facolta/?fac_id=1&lingua_iso6392_cod=\'ita\'',
		],
		'ATENEI': [
			'http://localhost:8080/Esse3RestApi/rest/atenei'
		],
		'CDS_FACOLTA': [
			'http://localhost:8080/Esse3RestApi/rest/corsi_di_studio/aa_id/2018/tipo_corso/L2/?cla_id=0&fac_id=10009&cds_des=biotecnologie&aa_ord_id=2013&norm_id=3&lingua_iso6392_cod=ita',
			'http://localhost:8080/Esse3RestApi/rest/corsi_di_studio/aa_id/2018/cds_id/10051/?cla_id=0&fac_id=10009&cds_des=biotecnologie&aa_ord_id=2013&norm_id=3&lingua_iso6392_cod=ita'
		],
		'TIPI_CORSO': [
			'http://localhost:8080/Esse3RestApi/rest/tipi_corsi_di_studio',
		],
		'CLASSE_CDS': [
			'http://localhost:8080/Esse3RestApi/rest/classe_di_laurea_corso_di_studio/cds_id/10051/?lingua_iso6392_cod=eng',
		],
		'LISTA_CDSORD': [
			'http://localhost:8080/Esse3RestApi/rest/elenco_ordinamenti_corso_di_studio/cds_id/10013/?lingua_iso6392_cod=ita',
		],
		'DETT_CDSORD': [
			'http://localhost:8080/Esse3RestApi/rest/dati_di_dettaglio_ordinamento_didattico/cds_id/10013/aa_ord_id/2017/?lingua_iso6392_cod=eng',
		],
		'LISTA_PDSORD': [
			'http://localhost:8080/Esse3RestApi/rest/elenco_percorsi_corso_di_studio/cds_id/10013/aa_ord_id/2017/?lingua_iso6392_cod=eng',
		],
		'DETT_PDSORD': [
			'http://localhost:8080/Esse3RestApi/rest/dati_di_dettaglio_percorso_di_studio/cds_id/10013/aa_ord_id/2017/pds_id/5/?lingua_iso6392_cod=ita',
		],
		'LISTA_AD_PDSORD': [
			'http://localhost:8080/Esse3RestApi/rest/elenco_attivita_didattiche_percorso_di_studio/cds_id/10013/aa_ord_id/2017/aa_off_id/2017/pds_id/5/?ad_id=34381&lingua_iso6392_cod=ita',
		],
		'INFO_PART_AD_PDSORD': [
			'http://localhost:8080/Esse3RestApi/rest/periodo_didattico_attivita_didattiche_percorso_di_studio/cds_id/10013/aa_ord_id/2017/aa_off_id/2017/pds_id/5?lingua_iso6392_cod=ita',
		],
		'INFO_LOG_AD_PDSORD': [
			'http://localhost:8080/Esse3RestApi/rest/informazioni_logistiche_attivita_didattiche_percorso_di_studio/cds_id/10013/aa_ord_id/2017/aa_off_id/2017/pds_id/5/?ad_id=34381&lingua_iso6392_cod=ita',
		],
		'LISTA_DOCENTI_AD': [
			'http://localhost:8080/Esse3RestApi/rest/docenti_attivita_didattiche_percorso_di_studio/ad_log_id/33929/?tit_flg=1',
			'http://localhost:8080/Esse3RestApi/rest/docenti_attivita_didattiche_percorso_di_studio/cds_is/10013/aa_ord_id/2017/aa_off_id/2017/pds_id/5/ad_id/34381/?tit_flg=1',
		],
		'INFO_REGSCE_PDSORD': [
			'http://localhost:8080/Esse3RestApi/rest/regole_scelta_attivita_didattiche_percorso_di_studio/cds_id/10013/aa_ord_id/2017/aa_off_id/2017/pds_id/5/anno_coorte/2017',
		],
		'SEG_PDSORD': [
			'http://localhost:8080/Esse3RestApi/rest/segmenti_percorso_di_studio_o_attivita_didattica/aa_off_id/2017/ad_log_id/33929/?ad_id=34381&lingua_iso6392_cod=ita',
			'http://localhost:8080/Esse3RestApi/rest/segmenti_percorso_di_studio_o_attivita_didattica/aa_off_id/2017/cds_id/10013/aa_ord_id/2017/psd_id/2/?ad_id=34381&lingua_iso6392_cod=ita',
		],
		'CONTENUTI_AD_PDSORD': [
			'http://localhost:8080/Esse3RestApi/rest/contenuti_attivita_didattica/aa_off_id/2017?lingua_iso6392_cod=ita&ad_log_id=33929',
			'http://localhost:8080/Esse3RestApi/rest/contenuti_attivita_didattica/aa_off_id/2017?lingua_iso6392_cod=ita&cds_id=10013&aa_ord_id=2017&pds_id=5&ad_id=34381',
		],
		'REGP_TAF': [
			'http://localhost:8080/Esse3RestApi/rest/regole_di_percorso_tipi_attivita_formative/cds_id/10013/aa_ord_id/2017/pds_id/5/prof_cod/1/aa_reg_id/2017/?lingua_iso6392_cod=ita',
		],
		'REGP_AMB': [
			'http://localhost:8080/Esse3RestApi/rest/regole_di_percorso_ambiti_disciplinari/cds_id/10013/aa_ord_id/2017/pds_id/5/prof_cod/1/aa_reg_id/2017/?lingua_iso6392_cod=ita',
		],
		'LISTA_AD_FISICHE': [
			'http://localhost:8080/Esse3RestApi/rest/elenco_attivita_didattiche_fisiche/aa_off_id/2017/?cds_id=10013&lingua_iso6392_cod=ita',
		],
		'LISTA_AD_FISICHE_DOCENTE': [
			'http://localhost:8080/Esse3RestApi/rest/elenco_attivita_didattiche_fisiche_con_docenti_e_partizioni/aa_off_id/2017/?cds_id=10013&lingua_iso6392_cod=ita',
		],
		'LISTA_UD_PDSORD': [
			'http://localhost:8080/Esse3RestApi/rest/elenco_unita_didattiche_attivita_didattica/cds_id/10013/aa_ord_id/2017/pds_id/5/aa_off_id/2017/ad_id/34381/?lingua_iso6392_cod=ita',
		],
		'COMUNITA_AD_PDSORD': [],
	}

	for k,v in kvreq.items():
		opc = k
		for req in v:
				rc = requests.get(req)
				print("RES > " + tcols.BLUE + str(rc) + tcols.ENDC)
				print("OPC > " + tcols.WARNING + opc + tcols.ENDC)
				print("OPL > " + tcols.HEADER + req + tcols.ENDC)

				if(rc.status_code != 200):
					print(tcols.WARNING + tcols.FAIL + "!!!!!!!!!!!! PANIC !!!!!!!!!!!!" + tcols.ENDC + "\n")
					continue

				r = rc.json()

				if r['data'] is None:
					print("RET > " + tcols.FAIL + "NULL" + tcols.ENDC + "\n")

					out_file.write("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\n\n")
					out_file.write("RESPONSE: " + str(rc) + "\n")
					out_file.write("OP__CODE: " + opc + "\n")
					out_file.write("OP__LINK: " + req + "\n")
					out_file.write("JSON_RES: \n")
					out_file.write(json.dumps(r, sort_keys=True, indent=4))
					out_file.write("\n\n$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\n")

				else:
					print("RET > " + tcols.SUCCESS + "OK" + tcols.ENDC + "\n")
					
					out_file.write("##################################################\n\n")
					out_file.write("RESPONSE: " + str(rc) + "\n")
					out_file.write("OP__CODE: " + opc + "\n")
					out_file.write("OP__LINK: " + req + "\n")
					out_file.write("JSON_RES: \n")
					out_file.write(json.dumps(r, sort_keys=True, indent=4))
					out_file.write("\n\n##################################################\n")
	
out_file.close()