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
import jakarta.xml.bind.annotation.XmlTransient;
import java.io.Serializable;
import java.util.Collection;

/**
 *
 * @author madrid
 */
@Entity
@Table(name = "donor")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Donor.findAll", query = "SELECT d FROM Donor d"),
    @NamedQuery(name = "Donor.findByUserId", query = "SELECT d FROM Donor d WHERE d.userId = :userId"),
    @NamedQuery(name = "Donor.findByDonorType", query = "SELECT d FROM Donor d WHERE d.donorType = :donorType"),
    @NamedQuery(name = "Donor.findByCompanyName", query = "SELECT d FROM Donor d WHERE d.companyName = :companyName"),
    @NamedQuery(name = "Donor.findByTaxId", query = "SELECT d FROM Donor d WHERE d.taxId = :taxId")})
public class Donor implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Column(name = "userId")
    private Long userId;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 7)
    @Column(name = "donorType")
    private String donorType;
    @Size(max = 255)
    @Column(name = "companyName")
    private String companyName;
    @Size(max = 50)
    @Column(name = "taxId")
    private String taxId;
    @JoinColumn(name = "userId", referencedColumnName = "id", insertable = false, updatable = false)
    @OneToOne(optional = false, fetch = FetchType.EAGER)
    private User user;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "donorId", fetch = FetchType.EAGER)
    private Collection<Donation> donationCollection;

    public Donor() {
    }

    public Donor(Long userId) {
        this.userId = userId;
    }

    public Donor(Long userId, String donorType) {
        this.userId = userId;
        this.donorType = donorType;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getDonorType() {
        return donorType;
    }

    public void setDonorType(String donorType) {
        this.donorType = donorType;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getTaxId() {
        return taxId;
    }

    public void setTaxId(String taxId) {
        this.taxId = taxId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @XmlTransient
    public Collection<Donation> getDonationCollection() {
        return donationCollection;
    }

    public void setDonationCollection(Collection<Donation> donationCollection) {
        this.donationCollection = donationCollection;
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
        if (!(object instanceof Donor)) {
            return false;
        }
        Donor other = (Donor) object;
        if ((this.userId == null && other.userId != null) || (this.userId != null && !this.userId.equals(other.userId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entities.Donor[ userId=" + userId + " ]";
    }
    
}
