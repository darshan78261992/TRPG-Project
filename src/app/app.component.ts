import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AttributesService } from './services/attributesService';
import { CombatAttributeService } from './services/combatAttributeService';
import { SkillAttributesService } from './services/skillAttributesService';
import { RankListEnums } from './common/Enums/ranksEnum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'TRPG';
  userAttributeForm = new FormGroup({});
  attributes: any;
  combatAttributes: any;
  skillAttributes: any;
  attributeName = '';
  attribute = '';
  armorBonus = 0;
  traitsBonus = 0;
  constructor(
    private attributesService: AttributesService,
    private combatAttributeService: CombatAttributeService,
    private skillAttributeService: SkillAttributesService,
    private fb: FormBuilder) {

  }
  // This method get call when page get render
  ngOnInit(): void {
    this.initMethods();
  }
  // This is Initial Methods get called when page get render
  initMethods(): void {
    this.userAttributeForm = this.fb.group({
      characterName: ['Tim Tam'],
      strength: [0],
      dexterity: [0],
      mind: [0],
      presence: [0],
      vitality: [0],
      evasion: [0],
      armor: [0],
      alacrity: [0],
      tenacity: [0],
      power: [0],
      damage: [0],
    });
    this.attributesService.getAttributes().subscribe(x => {
      this.attributes = x;
    });
    this.combatAttributeService.getCombatAttributes().subscribe(x => {
      this.combatAttributes = x;
    });
    this.skillAttributeService.getSkillAttributes().subscribe(x => {
      this.skillAttributes = x;
    });
  }
  // This method is use to add armor bonus
  addArmorBonus(event): void {
    if (event.target.checked) {
      this.armorBonus = 5;
      this.addRemoveBonus(this.armorBonus, true);
    } else {
      this.addRemoveBonus(this.armorBonus, false);
      this.armorBonus = 0;
    }
  }
  // This method is use to add traits bonus
  addTraitsBonus(event): void {
    if (event.target.checked) {
      this.traitsBonus = 2;
      this.addRemoveBonus(this.traitsBonus, true);
    } else {
      this.addRemoveBonus(this.traitsBonus, false);
      this.traitsBonus = 0;
    }
  }
  // This method is use to add and remove bonus
  addRemoveBonus(bonusValue: number, isAdd: boolean): void {
    const evasion = this.userAttributeForm.controls.evasion.value;
    const armor = this.userAttributeForm.controls.armor.value;
    if (isAdd) {
      this.userAttributeForm.controls.evasion.setValue(evasion + bonusValue);
      this.userAttributeForm.controls.armor.setValue(armor + bonusValue);
    } else {
      this.userAttributeForm.controls.evasion.setValue(evasion - bonusValue);
      this.userAttributeForm.controls.armor.setValue(armor - bonusValue);
    }
  }
  // This method is to use for textbox to check character or number
  checkOnlyNumber(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  // Evaluate Attribute points and show result
  evaluateAttribute(event: any): void {

    switch (event.target.getAttribute('data-attributename')) {
      case 'strength':
        this.userAttributeForm.controls.vitality.setValue(3 + parseInt(event.target.value, 10));
        break;
      case 'dexterity':
        this.userAttributeForm.controls.evasion.setValue(10 + this.traitsBonus + this.armorBonus + parseInt(event.target.value, 10));
        this.userAttributeForm.controls.armor.setValue(10 + this.traitsBonus + this.armorBonus + parseInt(event.target.value, 10));
        this.userAttributeForm.controls.alacrity.setValue(parseInt(this.userAttributeForm.controls.mind.value, 10)
          + parseInt(event.target.value, 10));
        break;
      case 'mind':
        this.userAttributeForm.controls.alacrity.setValue(parseInt(this.userAttributeForm.controls.dexterity.value, 10)
          + parseInt(event.target.value, 10));
        break;
      case 'presence':
        this.userAttributeForm.controls.tenacity.setValue(1 + parseInt(event.target.value, 10));
        break;
    }
  }
  // Evaluate Skill Attribute points and show result
  evaluateSkillAttribute(event: any): void {
    this.attribute = this.attributeName = event.target.value.toLowerCase();
    this.evaluateSkillPoint(this.attribute);
  }
  // Evaluate Skill Attribute points and show result
  evaluateSkillPoint(attribute: string): void {
    let point = 0;
    switch (attribute) {
      case 'strength':
        point = this.userAttributeForm.controls.strength.value;
        break;
      case 'dexterity':
        point = this.userAttributeForm.controls.dexterity.value;
        break;
      case 'mind':
        point = this.userAttributeForm.controls.mind.value;
        break;
      case 'presence':
        point = this.userAttributeForm.controls.presence.value;
        break;
    }
    const rank = this.checkRankPoint(point);
    this.skillAttributes.forEach(sa => {

      if (sa.attribute?.toLowerCase() === attribute) {
        sa.skills?.forEach(ss => {
          ss.rank = RankListEnums[rank],
            ss.value = this.fetchSkillPoint(RankListEnums[rank], parseInt(rank.toString(), 10));
        });
      }
    });
  }
  // This method is to validate rank point and return rank number to assign
  checkRankPoint(point: any): RankListEnums {
    switch (true) {
      case point >= 80 && point < 100:
        return RankListEnums.Expert;
      case point >= 60 && point < 80:
        return RankListEnums.Adept;
      case point >= 40 && point < 60:
        return RankListEnums.Apprentice;
      case point >= 20 && point < 40:
        return RankListEnums.Novice;
      case point < 20:
        return RankListEnums.Untrained;
      default:
        return RankListEnums.Master;
    }
  }
  // This method will return random number for skill
  fetchSkillPoint(rankName: string, rank: number): number {
    let level = 0;
    if (rankName === 'Untrained') {
      level = Math.min(
        this.randomNumber(1, 20),
        this.randomNumber(1, 20)
      );
    } else {
      level = this.randomNumber(1, 20) + this.randomNumber(1, 4 + 2 * (rank - 1));
    }
    return level;
  }
  // This method will return random number for skill
  randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }
  // This method refresh skill attribute point
  RefreshSkillPoint(): void {
    this.evaluateSkillPoint(this.attribute);
  }
  // This mehtod is to evaluat the damage and set result accordingly
  evaluateDamage(): void {
    const vitality = parseInt(this.userAttributeForm.controls.strength.value, 10) + 3;
    const damage = this.userAttributeForm.controls.damage.value != null ?
      parseInt(this.userAttributeForm.controls.damage.value, 10) : vitality;
    const finalVaule = vitality - damage;
    this.userAttributeForm.controls.vitality.setValue(finalVaule);
  }
  // This method is to export user skills and attributes
  Export(): void {
    console.log(this.userAttributeForm.value);
    alert('Data has exported.');
  }
  // This method is to import user skills and attributes
  Import(): void {
    alert('Data has imported.');
    console.log(this.userAttributeForm.value);
  }
}
