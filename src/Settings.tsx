import React from "react";
import { Form, Button } from "react-bootstrap";
import Config from "./Config";

interface SettingsAttributes {
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
            inTheZone: newInTheZone,
            workingDay: props.workingDay,
            workingWeek: props.workingWeek
        })
    }

    function updateWorkingDay(newWorkingDay: number) {
        props.onChange({
            inTheZone: props.inTheZone,
            workingDay: newWorkingDay,
            workingWeek: props.workingWeek
        })
    }

    function updateWorkingWeek(newWorkingWeek: number) {
        props.onChange({
            inTheZone: props.inTheZone,
            workingDay: props.workingDay,
            workingWeek: newWorkingWeek
        })
    }

    function formatMinutesInTheZone(inTheZone: number) {
        return (props.inTheZone / (60 * 1000)).toString() + " minutes";
    }

    function formatHoursInWorkingDay(workingDay: number) {
        return (props.workingDay / (60 * 60 * 1000)).toString() + " hours";
    }

    function formatDaysInWorkingWeek(workingWeek: number) {
        return (props.workingWeek / props.workingDay).toString() + " days";
    }

    return <Form>
        <Form.Group>
            <Form.Label>Minutes to get into the zone ({formatMinutesInTheZone(props.inTheZone)})</Form.Label>
            <Form.Control type="range" min={1} max={20}
                defaultValue={props.inTheZone / (60 * 1000)}
                onChange={e => updateInTheZone(parseInt(e.target.value) * 60 * 1000)}
                ></Form.Control>
            <Form.Text>How long does it take for you to get into the zone?</Form.Text>
        </Form.Group>

        <Form.Group>
            <Form.Label>Hours in a working day ({formatHoursInWorkingDay(props.workingDay)})</Form.Label>
            <Form.Control type="range" min={0.5} max={12} step={0.5}
                defaultValue={props.workingDay / (60 * 60 * 1000)}
                onChange={e => updateWorkingDay(parseFloat(e.target.value) * 60 * 60 * 1000)}
                ></Form.Control>
            <Form.Text>How many hours are there in your working day?</Form.Text>
        </Form.Group>

        <Form.Group>
            <Form.Label>Days in a working week {formatDaysInWorkingWeek(props.workingWeek)}</Form.Label>
            <Form.Control type="range" min={1} max={7}
                defaultValue={props.workingWeek / props.workingDay}
                onChange={e => updateWorkingWeek(parseInt(e.target.value) * props.workingDay)}
                ></Form.Control>
            <Form.Text>How many days do you work each week?</Form.Text>
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