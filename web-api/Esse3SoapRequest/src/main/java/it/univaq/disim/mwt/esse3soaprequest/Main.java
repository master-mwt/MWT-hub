package it.univaq.disim.mwt.esse3soaprequest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.HashMap;
import java.util.Map;
import org.w3c.dom.Document;

public class Main {
    public static void main(String[] args){
        
        Map<String, String> inputParameters = new HashMap<>();
        
        // OP: ANNO_ACCADEMICO_CORRENTE
        String opcode = "GET_CURR_AA";          
        inputParameters.put("tipo_data_rif_cod", "DR_CALESA");
        
        String response = Esse3SoapRequest.request(opcode, inputParameters);
        
        String contentBody = XmlDealer.getContentString(response);
        XmlDealer.out(contentBody); 
                     
        // converting to xml to object
        Document body = XmlDealer.getContentDocument(response);
        // Ritorna NULL
        System.out.println(body.toString());
        
        // ECCEZIONE
        // AnnoAccademico ac = JAXBDealer.<AnnoAccademico>unMarshall(AnnoAccademico.class, trim(row));
        // System.out.println("Anno Accademico: \n\n");
        // System.out.println(ac.toString());
    }
    
    private static String trim(String input) {
    BufferedReader reader = new BufferedReader(new StringReader(input));
    StringBuilder result = new StringBuilder();
    try {
        String line;
        while ( (line = reader.readLine() ) != null)
            result.append(line.trim());
        return result.toString();
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
}
}
