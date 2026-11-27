/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package entities;

import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.xml.bind.annotation.XmlRootElement;
//import jakarta.xml.bind.annotation.XmlTransient;
import java.io.Serializable;
import java.util.Collection;

/**
 *
 * @author madrid
 */
@Entity
@Table(name = "therapist")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Therapist.findAll", query = "SELECT t FROM Therapist t"),
    @NamedQuery(name = "Therapist.findByUserId", query = "SELECT t FROM Therapist t WHERE t.userId = :userId"),
    @NamedQuery(name = "Therapist.findBySpecialty", query = "SELECT t FROM Therapist t WHERE t.specialty = :specialty"),
    @NamedQuery(name = "Therapist.findByLicenseNumber", query = "SELECT t FROM Therapist t WHERE t.licenseNumber = :licenseNumber"),
    @NamedQuery(name = "Therapist.findByIsAvailable", query = "SELECT t FROM Therapist t WHERE t.isAvailable = :isAvailable")})
public class Therapist implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Column(name = "userId")
    private Long userId;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "specialty")
    private String specialty;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "licenseNumber")
    private String licenseNumber;
    @Basic(optional = false)
    @NotNull
    @Column(name = "isAvailable")
    private boolean isAvailable;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "therapistId", fetch = FetchType.EAGER)
    private Collection<Appointment> appointmentCollection;
    @JoinColumn(name = "userId", referencedColumnName = "id", insertable = false, updatable = false)
    @OneToOne(optional = false, fetch = FetchType.EAGER)
    private User user;

    public Therapist() {
    }

    public Therapist(Long userId) {
        this.userId = userId;
    }

    public Therapist(Long userId, String specialty, String licenseNumber, boolean isAvailable) {
        this.userId = userId;
        this.specialty = specialty;
        this.licenseNumber = licenseNumber;
        this.isAvailable = isAvailable;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
    
    //@XmlTransient
    public Collection<Appointment> getAppointmentCollection() {
        return appointmentCollection;
    }

    public void setAppointmentCollection(Collection<Appointment> appointmentCollection) {
        this.appointmentCollection = appointmentCollection;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (userId != null ? userId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Therapist)) {
            return false;
        }
        Therapist other = (Therapist) object;
        if ((this.userId == null && other.userId != null) || (this.userId != null && !this.userId.equals(other.userId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entities.Therapist[ userId=" + userId + " ]";
    }
    
}
