package it.univaq.disim.mwt.esse3soaprequest;

import java.io.IOException;
import java.io.StringReader;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

public class XmlDealer {
    
    public static void out(String nonFormattedXml){
        try {
            xmlParser(nonFormattedXml);
            
        } catch(SAXException | IOException | ParserConfigurationException | TransformerException ex){
            Logger.getLogger(XmlDealer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public static String getContentString(String xmlResponse){
        try {
            return getResponseBody(xmlResponse).getTextContent();
            
        } catch (ParserConfigurationException | SAXException | IOException ex) {
            Logger.getLogger(XmlDealer.class.getName()).log(Level.SEVERE, null, ex);
        }
        
        return null;
    }
    
    public static Node getContentNode(String xmlResponse){
        try {
            return getResponseBody(xmlResponse);
            
        } catch (ParserConfigurationException | SAXException | IOException ex) {
            Logger.getLogger(XmlDealer.class.getName()).log(Level.SEVERE, null, ex);
        }
        
        return null;
    }
    
    private static Node getResponseBody(String xmlResponse) throws ParserConfigurationException, SAXException, IOException{
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(new InputSource(new StringReader(xmlResponse)));
        
        return document.getElementsByTagName("ns1:fn_retrieve_xml_pResponse").item(0);
    }
    
    private static void xmlParser(String nonFormattedXml) throws SAXException, IOException, ParserConfigurationException, TransformerConfigurationException, TransformerException{
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(new InputSource(new StringReader(nonFormattedXml)));
        
        Transformer tform = TransformerFactory.newInstance().newTransformer();
        tform.setOutputProperty(OutputKeys.INDENT, "yes");
        tform.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
        tform.transform(new DOMSource(document),new StreamResult(System.out));

    }
}
