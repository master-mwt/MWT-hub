package it.univaq.disim.mwt.esse3soaprequest;

import java.io.ByteArrayInputStream;
import java.io.UnsupportedEncodingException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import org.xml.sax.InputSource;

public class JAXBDealer {
    
    public static <T> T unMarshall(Class classType, String xml){
        
        T result = null;
        
        try {
            result = unMarshallAux(classType, xml);
            
        } catch (JAXBException | UnsupportedEncodingException ex) {
            Logger.getLogger(JAXBDealer.class.getName()).log(Level.SEVERE, null, ex);
        }
        
        return result;
    }
    
    private static <T> T unMarshallAux(Class classType, String xml) throws JAXBException, UnsupportedEncodingException {
        JAXBContext jaxbContext = JAXBContext.newInstance(classType);
        Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
     
        return (T)jaxbUnmarshaller.unmarshal(new InputSource(new ByteArrayInputStream(xml.getBytes("UTF-8"))));
    }
}
