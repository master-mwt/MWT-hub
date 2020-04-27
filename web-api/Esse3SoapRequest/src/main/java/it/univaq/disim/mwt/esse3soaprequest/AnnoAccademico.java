package it.univaq.disim.mwt.esse3soaprequest;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "Row")
public class AnnoAccademico {
    
    private int aa_id;
    private String des;
    private String data_inizio;
    private String data_fine;

    public int getAa_id() {
        return aa_id;
    }

    public void setAa_id(int aa_id) {
        this.aa_id = aa_id;
    }

    public String getDes() {
        return des;
    }

    public void setDes(String des) {
        this.des = des;
    }

    public String getData_inizio() {
        return data_inizio;
    }

    public void setData_inizio(String data_inizio) {
        this.data_inizio = data_inizio;
    }

    public String getData_fine() {
        return data_fine;
    }

    public void setData_fine(String data_fine) {
        this.data_fine = data_fine;
    }

    @Override
    public String toString() {
        return "AnnoAccademico{" + "aa_id=" + aa_id + ", des=" + des + ", data_inizio=" + data_inizio + ", data_fine=" + data_fine + '}';
    }
   
}
