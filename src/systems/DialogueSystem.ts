import { DialogueNode, DialogueChoice } from '../types';
import { DIALOGUE_CATALOG } from '../data/DialogueCatalog';
import { StoryManager } from './StoryManager';
import { InventorySystem } from './InventorySystem';
import { NotebookSystem } from './NotebookSystem';

export class DialogueSystem {
  private static instance: DialogueSystem | null = null;
  private currentNode: DialogueNode | null = null;
  private currentLineIndex: number = 0;
  private storyManager: StoryManager;
  private inventory: InventorySystem;
  private notebook: NotebookSystem;
  private listeners: Array<(event: string, data?: any) => void> = [];

  private constructor() {
    this.storyManager = StoryManager.getInstance();
    this.inventory = InventorySystem.getInstance();
    this.notebook = NotebookSystem.getInstance();
  }

  public static getInstance(): DialogueSystem {
    if (!DialogueSystem.instance) {
      DialogueSystem.instance = new DialogueSystem();
    }
    return DialogueSystem.instance;
  }

  public static resetInstance(): void {
    DialogueSystem.instance = new DialogueSystem();
  }

  public startDialogue(nodeId: string): boolean {
    const node = DIALOGUE_CATALOG[nodeId];
    if (!node) {
      console.warn(`[DialogueSystem] Dialogue node not found: ${nodeId}`);
      return false;
    }

    this.currentNode = node;
    this.currentLineIndex = 0;
    this.executeNodeEnter(node);
    this.emit('dialogueStarted', node);
    return true;
  }

  public getCurrentNode(): DialogueNode | null {
    return this.currentNode;
  }

  public getCurrentSpeaker(): string | null {
    return this.currentNode?.speaker ?? null;
  }

  public getCurrentLine(): string | null {
    if (!this.currentNode || this.currentLineIndex >= this.currentNode.lines.length) {
      return null;
    }
    return this.currentNode.lines[this.currentLineIndex];
  }

  public hasMoreLines(): boolean {
    if (!this.currentNode) return false;
    return this.currentLineIndex < this.currentNode.lines.length - 1;
  }

  public isAtChoices(): boolean {
    if (!this.currentNode) return false;
    return (
      this.currentLineIndex >= this.currentNode.lines.length - 1 &&
      Boolean(this.currentNode.choices && this.currentNode.choices.length > 0)
    );
  }

  public getAvailableChoices(): DialogueChoice[] {
    if (!this.currentNode?.choices) return [];

    return this.currentNode.choices.filter(choice => {
      if (choice.requiresFlag && !this.storyManager.getFlag(choice.requiresFlag)) {
        return false;
      }
      if (choice.requiresItem && !this.inventory.hasItem(choice.requiresItem)) {
        return false;
      }
      if (choice.requiresClue && !this.notebook.hasClue(choice.requiresClue)) {
        return false;
      }
      return true;
    });
  }

  public advance(): boolean {
    if (!this.currentNode) return false;

    // If more lines exist, advance to next line
    if (this.currentLineIndex < this.currentNode.lines.length - 1) {
      this.currentLineIndex++;
      this.emit('lineAdvanced', {
        line: this.getCurrentLine(),
        index: this.currentLineIndex,
        total: this.currentNode.lines.length
      });
      return true;
    }

    // If choices are present at the end of lines, wait for choice selection
    if (this.currentNode.choices && this.currentNode.choices.length > 0) {
      return true;
    }

    // If nextId is specified, jump to it
    if (this.currentNode.nextId) {
      return this.startDialogue(this.currentNode.nextId);
    }

    // End of dialogue
    this.endDialogue();
    return false;
  }

  public selectChoice(choiceIndex: number): boolean {
    const choices = this.getAvailableChoices();
    const choice = choices[choiceIndex];

    if (!choice) return false;

    // Execute choice action if any
    if (choice.action) {
      if (choice.action.setFlag) {
        this.storyManager.setFlag(choice.action.setFlag, true);
      }
      if (choice.action.giveItemId) {
        this.inventory.addItem(choice.action.giveItemId);
      }
      if (choice.action.addClueId) {
        this.notebook.addClue(choice.action.addClueId);
      }
    }

    this.emit('choiceSelected', choice);
    return this.startDialogue(choice.targetNodeId);
  }

  public endDialogue(): void {
    if (this.currentNode) {
      const closedNode = this.currentNode;
      this.currentNode = null;
      this.currentLineIndex = 0;
      this.emit('dialogueEnded', closedNode);
    }
  }

  public isActive(): boolean {
    return this.currentNode !== null;
  }

  private executeNodeEnter(node: DialogueNode): void {
    if (!node.onNodeEnter) return;

    if (node.onNodeEnter.setFlag) {
      this.storyManager.setFlag(node.onNodeEnter.setFlag, true);
    }
    if (node.onNodeEnter.giveItemId) {
      this.inventory.addItem(node.onNodeEnter.giveItemId);
    }
    if (node.onNodeEnter.addClueId) {
      this.notebook.addClue(node.onNodeEnter.addClueId);
    }
  }

  public on(listener: (event: string, data?: any) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private emit(event: string, data?: any): void {
    for (const listener of this.listeners) {
      try {
        listener(event, data);
      } catch (e) {
        console.error('[DialogueSystem] Listener error', e);
      }
    }
  }
}
