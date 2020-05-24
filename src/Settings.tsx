import React from "react";
import { Form, Button } from "react-bootstrap";
import Config from "./Config";

interface SettingsAttributes {
    storageKey: string;
    inTheZone: number;
    workingDay: number;
    workingWeek: number;
}

interface SettingsEvents {
    onChange: (settings: Config) => void;
    onResetHistory: () => void;
    onResetConfig: () => void;
}

interface SettingsProps extends SettingsAttributes, SettingsEvents {
}

function Settings(props: SettingsProps) {

    function updateInTheZone(newInTheZone: number) {
        props.onChange({
            storageKey: props.storageKey,
            inTheZone: newInTheZone,
            workingDay: props.workingDay,
            workingWeek: props.workingWeek
        })
    }

    function updateWorkingDay(newWorkingDay: number) {
        props.onChange({
            storageKey: props.storageKey,
            inTheZone: props.inTheZone,
            workingDay: newWorkingDay,
            workingWeek: props.workingWeek
        })
    }

    function updateWorkingWeek(newWorkingWeek: number) {
        props.onChange({
            storageKey: props.storageKey,
            inTheZone: props.inTheZone,
            workingDay: props.workingDay,
            workingWeek: newWorkingWeek
        })
    }

    function updateStorageKey(newStorageKey: string) {
        props.onChange({
            storageKey: newStorageKey,
            inTheZone: props.inTheZone,
            workingDay: props.workingDay,
            workingWeek: props.workingWeek
        })
    }

    return <Form>
        <Form.Group>
            <Form.Label>Minutes to get into the zone</Form.Label>
            <Form.Control type="range" min={1} max={20}
                defaultValue={props.inTheZone / (60 * 1000)}
                title={(props.inTheZone / (60 * 1000)).toString() + " minutes"}
                onChange={e => updateInTheZone(parseInt(e.target.value) * 60 * 1000)}
                ></Form.Control>
            <Form.Text>How long does it take for you to get into the zone?</Form.Text>
        </Form.Group>

        <Form.Group>
            <Form.Label>Hours in a working day</Form.Label>
            <Form.Control type="range" min={0.5} max={12} step={0.5}
                defaultValue={props.workingDay / (60 * 60 * 1000)}
                title={(props.workingDay / (60 * 60 * 1000)).toString() + " hours"}
                onChange={e => updateWorkingDay(parseFloat(e.target.value) * 60 * 60 * 1000)}
                ></Form.Control>
            <Form.Text>How many hours are there in your working day?</Form.Text>
        </Form.Group>

        <Form.Group>
            <Form.Label>Days in a working week</Form.Label>
            <Form.Control type="range" min={1} max={7}
                defaultValue={props.workingWeek / props.workingDay}
                title={(props.workingWeek / props.workingDay).toString() + " days"}
                onChange={e => updateWorkingWeek(parseInt(e.target.value) * props.workingDay)}
                ></Form.Control>
            <Form.Text>How many days do you work each week?</Form.Text>
        </Form.Group>

        <Form.Group>
            <Form.Label>Storage key</Form.Label>
            <Form.Control defaultValue={props.storageKey}
                onChange={e => updateStorageKey(e.target.value)} title={props.storageKey}></Form.Control>
            <Form.Text>The key to use</Form.Text>
        </Form.Group>

        <Form.Group>
            <Button variant="danger" onClick={() => {if (window.confirm('Delete all history?')) {props.onResetHistory()}}}>Reset history</Button>
            <Form.Text>Delete all coding history</Form.Text>
        </Form.Group>

        <Form.Group>
            <Button variant="danger" onClick={() => {if (window.confirm('Reset settings to defaults?')) {props.onResetConfig()}}}>Reset default settings</Button>
            <Form.Text>Reset these settings to their default values</Form.Text>
        </Form.Group>
    </Form>;
}

export default Settings;