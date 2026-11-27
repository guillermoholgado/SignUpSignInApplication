/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package entities;

import jakarta.json.bind.annotation.JsonbTransient;
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.XmlTransient;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 *
 * @author madrid
 */
@Entity
@Table(name = "donation")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Donation.findAll", query = "SELECT d FROM Donation d"),
    @NamedQuery(name = "Donation.findById", query = "SELECT d FROM Donation d WHERE d.id = :id"),
    @NamedQuery(name = "Donation.findByAmount", query = "SELECT d FROM Donation d WHERE d.amount = :amount"),
    @NamedQuery(name = "Donation.findByCurrency", query = "SELECT d FROM Donation d WHERE d.currency = :currency"),
    @NamedQuery(name = "Donation.findByFrequency", query = "SELECT d FROM Donation d WHERE d.frequency = :frequency"),
    @NamedQuery(name = "Donation.findByStatus", query = "SELECT d FROM Donation d WHERE d.status = :status"),
    @NamedQuery(name = "Donation.findByPaymentMethod", query = "SELECT d FROM Donation d WHERE d.paymentMethod = :paymentMethod"),
    @NamedQuery(name = "Donation.findByCreatedAt", query = "SELECT d FROM Donation d WHERE d.createdAt = :createdAt")})
public class Donation implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Long id;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Basic(optional = false)
    @NotNull
    @Column(name = "amount")
    private BigDecimal amount;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 3)
    @Column(name = "currency")
    private String currency;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 9)
    @Column(name = "frequency")
    private String frequency;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 9)
    @Column(name = "status")
    private String status;
    @Size(max = 50)
    @Column(name = "paymentMethod")
    private String paymentMethod;
    @Basic(optional = false)
    @NotNull
    @Column(name = "createdAt")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    @JoinColumn(name = "donorId", referencedColumnName = "userId")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Donor donorId;

    public Donation() {
    }

    public Donation(Long id) {
        this.id = id;
    }

    public Donation(Long id, BigDecimal amount, String currency, String frequency, String status, Date createdAt) {
        this.id = id;
        this.amount = amount;
        this.currency = currency;
        this.frequency = frequency;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
    @JsonbTransient
    @XmlTransient
    public Donor getDonorId() {
        return donorId;
    }

    public void setDonorId(Donor donorId) {
        this.donorId = donorId;
    }
    @jakarta.persistence.PrePersist 
    protected void onCreate() { 
            if (this.createdAt == null) { 
                this.createdAt = new Date(); 
            } 
    }  
    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Donation)) {
            return false;
        }
        Donation other = (Donation) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entities.Donation[ id=" + id + " ]";
    }
    
}