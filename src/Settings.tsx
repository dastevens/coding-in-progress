import React from "react";
import { Form, Button } from "react-bootstrap";

interface SettingsAttributes {
    storageKey: string;
    inTheZone: number;
    workingDay: number;
    workingWeek: number;
}

interface SettingsEvents {
    onChange?: (settings: SettingsAttributes) => void;
    onResetHistory: () => void;
}

interface SettingsProps extends SettingsAttributes, SettingsEvents {
}

function Settings(props: SettingsProps) {

    return <Form>
        <Form.Group>
            <Form.Label>Minutes to get into the zone</Form.Label>
            <Form.Control disabled type="range" min={1} max={20} defaultValue={props.inTheZone / (60 * 1000)}></Form.Control>
            <Form.Text>How long does it take for you to get into the zone?</Form.Text>
        </Form.Group>

        <Form.Group>
            <Form.Label>Hours in a working day</Form.Label>
            <Form.Control disabled type="range" min={0.5} max={12} step={0.5} defaultValue={props.workingDay / (60 * 60 * 1000)}></Form.Control>
            <Form.Text>How many hours are there in your working day?</Form.Text>
        </Form.Group>

        <Form.Group>
            <Form.Label>Days in a working week</Form.Label>
            <Form.Control disabled type="range" min={1} max={7} defaultValue={props.workingWeek / props.workingDay}></Form.Control>
            <Form.Text>How many days do you work each week?</Form.Text>
        </Form.Group>

        <Form.Group>
            <Form.Label>Storage key</Form.Label>
            <Form.Control disabled defaultValue={props.storageKey}></Form.Control>
            <Form.Text>The key to use</Form.Text>
        </Form.Group>

        <Form.Group>
            <Button variant="danger" onClick={() => {if (window.confirm('Delete all history?')) {props.onResetHistory()}}}>Reset history</Button>
            <Form.Text>Delete all coding history</Form.Text>
        </Form.Group>
    </Form>;
}

export default Settings;