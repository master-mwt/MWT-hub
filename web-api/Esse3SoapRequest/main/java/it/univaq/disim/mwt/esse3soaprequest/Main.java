package it.univaq.disim.mwt.esse3soaprequest;

import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args){
        
        Map<String, String> inputParameters = new HashMap<>();
        
        // OP: ANNO_ACCADEMICO_CORRENTE
        String opcode = "GET_CURR_AA";          
        inputParameters.put("tipo_data_rif_cod", "DR_CALESA");
        
        String response = Esse3SoapRequest.request(opcode, inputParameters);
        
        String contentBody = XmlDealer.getContentString(response);
        XmlDealer.out(contentBody);      
    }   
}
