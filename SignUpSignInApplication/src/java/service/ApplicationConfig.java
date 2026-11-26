/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package service;

import java.util.Set;

/**
 *
 * @author madrid
 */
@jakarta.ws.rs.ApplicationPath("webresources")
public class ApplicationConfig extends jakarta.ws.rs.core.Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        addRestResourceClasses(resources);
        return resources;
    }

    /**
     * Do not modify addRestResourceClasses() method.
     * It is automatically populated with
     * all resources defined in the project.
     * If required, comment out calling this method in getClasses().
     */
    private void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(service.AppointmentFacadeREST.class);
        resources.add(service.DonationFacadeREST.class);
        resources.add(service.DonorFacadeREST.class);
        resources.add(service.PatientFacadeREST.class);
        resources.add(service.TherapistFacadeREST.class);
        resources.add(service.UserFacadeREST.class);
    }
    
}
