import { Component, signal, OnInit } from '@angular/core';
import { ToysService } from '../services/toys.service';
import { RouterLink } from '@angular/router';
import { ToyModel } from '../models/toy.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-igracke',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './igracke.html',
  styleUrls: ['./igracke.css']
})
export class Igracke implements OnInit {

  protected toys = signal<ToyModel[]>([]);
  protected filteredToys = signal<ToyModel[]>([]);
  protected pretraga: string = '';
  
  protected selectedAgeGroup = signal<string>('svi');
  protected selectedType = signal<string>('svi');
  protected selectedTargetGroup = signal<string>('svi');
  
  protected ageGroups = signal<string[]>([]);
  protected toyTypes = signal<string[]>([]);

  ngOnInit() {
    ToysService.getToys()
      .then(rsp => {
        console.log('Igračke:', rsp.data);
        this.toys.set(rsp.data);
        this.filteredToys.set(rsp.data);
        this.extractFilterOptions(rsp.data);
      })
      .catch(err => console.error('Greška pri učitavanju igračaka:', err));
  }

  protected extractFilterOptions(toys: ToyModel[]) {

    const uniqueAgeGroups = [...new Set(toys.map(toy => toy.ageGroup.name))];
    this.ageGroups.set(uniqueAgeGroups);
    console.log('Uzrasti:', uniqueAgeGroups);

 
    const uniqueTypes = [...new Set(toys.map(toy => toy.type.name))];
    this.toyTypes.set(uniqueTypes);
    console.log('Tipovi:', uniqueTypes);
  }


  // filtriranje po onome sto korisnik ukuca, pa onda uzrast, tip i ciljna grupa
  filterToys() {
    const searchTerm = this.pretraga.toLowerCase();
    const ageGroupFilter = this.selectedAgeGroup();
    const typeFilter = this.selectedType();
    const targetGroupFilter = this.selectedTargetGroup();

    const filtered = this.toys().filter(toy => {
 
      const matchesSearch = !searchTerm || 
        toy.name.toLowerCase().includes(searchTerm) ||
        toy.description.toLowerCase().includes(searchTerm) ||
        toy.type.name.toLowerCase().includes(searchTerm);

 
      const matchesAgeGroup = ageGroupFilter === 'svi' || 
                             toy.ageGroup.name === ageGroupFilter;

    
      const matchesType = typeFilter === 'svi' || 
                         toy.type.name === typeFilter;

    
      const matchesTargetGroup = targetGroupFilter === 'svi' || 
                               toy.targetGroup?.toLowerCase() === targetGroupFilter.toLowerCase();

      return matchesSearch && matchesAgeGroup && matchesType && matchesTargetGroup;
    });

    this.filteredToys.set(filtered);
  }

  resetFilters() {
    this.selectedAgeGroup.set('svi');
    this.selectedType.set('svi');
    this.selectedTargetGroup.set('svi');
    this.pretraga = '';
    this.filterToys();
  }
}