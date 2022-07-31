import { TrafficLight } from './../traffic-light/traffic-light.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Dashboard {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    created_At: Date

    @Column()
    updated_At: Date

    @ManyToMany(() => TrafficLight, (trafficLight) => trafficLight.dashboards)
    trafficLights: TrafficLight[]
}