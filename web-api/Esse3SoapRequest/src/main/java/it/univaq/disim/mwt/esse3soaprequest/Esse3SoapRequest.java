package it.univaq.disim.mwt.esse3soaprequest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

public class Esse3SoapRequest {
    
    private final static String URL = "https://segreteriavirtuale.univaq.it/services/ESSE3WS";
    
    public static String request(String opcode, Map<String, String> inputParameters){
        return soapRequest(URL, opcode, MapToString(inputParameters));
    }
           
    private static String soapRequest(String urlString, String opcode, String inputParameters){

        HttpURLConnection con = null;
        String result = null;

	try {

		URL url = new URL(urlString);
		con = (HttpURLConnection)url.openConnection();
		con.setRequestMethod("POST");
		con.setRequestProperty("Content-Type", "application/xml; utf-8");
                con.setRequestProperty("SOAPAction", "");
		con.setDoOutput(true);

		String xmlRequest = "<soapenv:Envelope" + "\n" + 
                                        "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" + "\n" + 
                                        "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"" + "\n" + 
                                        "xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"" + "\n" + 
                                        "xmlns:ws=\"http://ws.esse3.frk.kion.it\">" + "\n" + 
                                        "<soapenv:Header/>" + "\n" + 
                                        "<soapenv:Body>" + "\n" + 
                                            "<ws:fn_retrieve_xml_p" + "\n" + 
                                                "soapenv:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">" + "\n" + 
                                            "<retrieve xsi:type=\"soapenc:string\"" + "\n" + 
                                                "xmlns:soapenc=\"http://schemas.xmlsoap.org/soap/encoding/\">" + opcode + "</retrieve>" + "\n" + 
                                            "<params xsi:type=\"soapenc:string\"" + "\n" + 
                                                "xmlns:soapenc=\"http://schemas.xmlsoap.org/soap/encoding/\">" + inputParameters + "</params>" + "\n" + 
                                            "<xml xsi:type=\"soapenc:string\" xmlns:soapenc=\"http://schemas.xmlsoap.org/soap/encoding/\"/>" + "\n" + 
                                            "</ws:fn_retrieve_xml_p>" + "\n" + 
                                        "</soapenv:Body>" + "\n" + 
                                        "</soapenv:Envelope>";
                                                              
		OutputStream os = con.getOutputStream();
		os.write(xmlRequest.getBytes());
		os.flush();
		os.close();

		int responseCode = con.getResponseCode();
		
		if (responseCode == HttpURLConnection.HTTP_OK) {
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuilder response = new StringBuilder();

			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();

			result = response.toString();
		} else {
			result = "HTTP Error: " + responseCode;
		}

	} catch(IOException e){
            e.printStackTrace();
	} finally {
            if(con != null){
                con.disconnect();
            }
              
        }

        return result;
    }
    
    private static String MapToString(Map<String, String> map){
        StringBuilder builder = new StringBuilder();
               
        for (Map.Entry<String, String> entry : map.entrySet()) {
            builder.append(entry.getKey() + "=");
            builder.append(entry.getValue() + ";");
        }
        builder.deleteCharAt(builder.length() - 1);
        
        return builder.toString();
    }
}
