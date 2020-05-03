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
		'http://localhost:8080/Esse3RestApi/rest/anno_accademico_corrente/DR_CALESA',
		'http://localhost:8080/Esse3RestApi/rest/anno_accademico_corrente/DR_CALESAa',
		],	
		'AA_LOOKUP': [
		'http://localhost:8080/Esse3RestApi/rest/elenco_anni_accademici/2021',
		'http://localhost:8080/Esse3RestApi/rest/elenco_anni_accademici/2005'
		],
		'CLASSI': [
		'http://localhost:8080/Esse3RestApi/rest/classi'
		],
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