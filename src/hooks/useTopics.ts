import { useState, useEffect, useCallback } from 'react';
import { Topic, SubTopic, generateRandomColor } from '@/models/topic';
import { ErrorHandler } from '@/utils/errorHandler';

interface TopicWithCount extends Topic {
  subTopicsCount: number;
}

export interface TopicFormData {
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  order: number;
}

export interface SubTopicFormData {
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
}

export interface UseTopics {
  topics: TopicWithCount[];
  selectedTopic: TopicWithCount | null;
  subtopics: SubTopic[];
  loading: boolean;
  showTopicForm: boolean;
  showSubTopicForm: boolean;
  editingTopic: TopicWithCount | null;
  editingSubTopic: SubTopic | null;
  topicFormData: TopicFormData;
  subTopicFormData: SubTopicFormData;

  // Actions
  refreshTopics: () => Promise<void>;
  setSelectedTopic: (topic: TopicWithCount | null) => void;
  createTopic: (data: TopicFormData) => Promise<void>;
  updateTopic: (data: TopicFormData) => Promise<void>;
  deleteTopic: (topic: TopicWithCount) => Promise<void>;
  createSubTopic: (data: SubTopicFormData) => Promise<void>;
  updateSubTopic: (data: SubTopicFormData) => Promise<void>;
  deleteSubTopic: (subtopic: SubTopic) => Promise<void>;
  
  // Form management
  openTopicForm: (topic?: TopicWithCount) => void;
  openSubTopicForm: (subtopic?: SubTopic) => void;
  closeForms: () => void;
  updateTopicForm: (data: Partial<TopicFormData>) => void;
  updateSubTopicForm: (data: Partial<SubTopicFormData>) => void;
}

export function useTopics(): UseTopics {
  const [topics, setTopics] = useState<TopicWithCount[]>([]);
  const [selectedTopic, setSelectedTopicState] = useState<TopicWithCount | null>(null);
  const [subtopics, setSubtopics] = useState<SubTopic[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [showSubTopicForm, setShowSubTopicForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState<TopicWithCount | null>(null);
  const [editingSubTopic, setEditingSubTopic] = useState<SubTopic | null>(null);
  
  const [topicFormData, setTopicFormData] = useState<TopicFormData>({
    name: '',
    description: '',
    icon: '📁',
    color: generateRandomColor(),
    isActive: true,
    order: 0,
  });

  const [subTopicFormData, setSubTopicFormData] = useState<SubTopicFormData>({
    name: '',
    description: '',
    icon: '📄',
    isActive: true,
    order: 0,
  });

  // Fetch topics
  const refreshTopics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/topics');
      if (response.ok) {
        const data = await response.json();
        setTopics(data);
        if (data.length > 0 && !selectedTopic) {
          setSelectedTopicState(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedTopic]);

  // Fetch subtopics when topic changes
  const fetchSubTopics = useCallback(async (topicId: string) => {
    try {
      const response = await fetch(`/api/topics/${topicId}/subtopics`);
      if (response.ok) {
        const data = await response.json();
        setSubtopics(data);
      }
    } catch (error) {
      console.error('Error fetching subtopics:', error);
    }
  }, []);

  useEffect(() => {
    if (selectedTopic?._id) {
      fetchSubTopics(selectedTopic._id.toString());
    }
  }, [selectedTopic, fetchSubTopics]);

  // Set selected topic
  const setSelectedTopic = (topic: TopicWithCount | null) => {
    setSelectedTopicState(topic);
  };

  // Topic CRUD operations
  const createTopic = async (data: TopicFormData) => {
    try {
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newTopic = await response.json();
        setTopics([...topics, { ...newTopic, subTopicsCount: 0 }]);
        closeForms();
      }
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  };

  const updateTopic = async (data: TopicFormData) => {
    if (!editingTopic) return;

    try {
      const response = await fetch(`/api/topics/${editingTopic._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedTopic = await response.json();
        setTopics(topics.map(t => 
          t._id?.toString() === editingTopic._id?.toString() 
            ? { ...updatedTopic, subTopicsCount: t.subTopicsCount }
            : t
        ));
        
        if (selectedTopic?._id?.toString() === editingTopic._id?.toString()) {
          setSelectedTopicState({ ...updatedTopic, subTopicsCount: selectedTopic?.subTopicsCount || 0 });
        }
        
        closeForms();
      }
    } catch (error) {
      console.error('Error updating topic:', error);
      throw error;
    }
  };

  const deleteTopic = async (topic: TopicWithCount) => {
    if (!ErrorHandler.confirmAction(`Are you sure you want to delete "${topic.name}"? This will also delete all its subtopics.`)) {
      return;
    }

    await ErrorHandler.handleAsyncOperation(async () => {
      const response = await fetch(`/api/topics/${topic._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete topic');
      }

      setTopics(topics.filter(t => t._id?.toString() !== topic._id?.toString()));
      if (selectedTopic?._id?.toString() === topic._id?.toString()) {
        setSelectedTopicState(topics.length > 1 ? topics[0] : null);
      }
      ErrorHandler.showSuccess('Topic deleted successfully');
    }, 'Failed to delete topic');
  };

  // SubTopic CRUD operations
  const createSubTopic = async (data: SubTopicFormData) => {
    if (!selectedTopic) return;

    try {
      const response = await fetch(`/api/topics/${selectedTopic._id}/subtopics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newSubTopic = await response.json();
        setSubtopics([...subtopics, newSubTopic]);
        setTopics(topics.map(t => 
          t._id?.toString() === selectedTopic._id?.toString()
            ? { ...t, subTopicsCount: t.subTopicsCount + 1 }
            : t
        ));
        closeForms();
      }
    } catch (error) {
      console.error('Error creating subtopic:', error);
      throw error;
    }
  };

  const updateSubTopic = async (data: SubTopicFormData) => {
    if (!editingSubTopic) return;

    try {
      const response = await fetch(`/api/subtopics/${editingSubTopic._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedSubTopic = await response.json();
        setSubtopics(subtopics.map(st => 
          st._id?.toString() === editingSubTopic._id?.toString() ? updatedSubTopic : st
        ));
        closeForms();
      }
    } catch (error) {
      console.error('Error updating subtopic:', error);
      throw error;
    }
  };

  const deleteSubTopic = async (subtopic: SubTopic) => {
    if (!confirm(`Are you sure you want to delete "${subtopic.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/subtopics/${subtopic._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSubtopics(subtopics.filter(st => st._id?.toString() !== subtopic._id?.toString()));
        if (selectedTopic) {
          setTopics(topics.map(t => 
            t._id?.toString() === selectedTopic._id?.toString()
              ? { ...t, subTopicsCount: t.subTopicsCount - 1 }
              : t
          ));
        }
      }
    } catch (error) {
      console.error('Error deleting subtopic:', error);
      throw error;
    }
  };

  // Form management
  const openTopicForm = (topic?: TopicWithCount) => {
    if (topic) {
      setEditingTopic(topic);
      setTopicFormData({
        name: topic.name,
        description: topic.description || '',
        icon: topic.icon || '📁',
        color: topic.color || generateRandomColor(),
        isActive: topic.isActive,
        order: topic.order,
      });
    } else {
      setEditingTopic(null);
      setTopicFormData({
        name: '',
        description: '',
        icon: '📁',
        color: generateRandomColor(),
        isActive: true,
        order: topics.length,
      });
    }
    setShowTopicForm(true);
  };

  const openSubTopicForm = (subtopic?: SubTopic) => {
    if (subtopic) {
      setEditingSubTopic(subtopic);
      setSubTopicFormData({
        name: subtopic.name,
        description: subtopic.description || '',
        icon: subtopic.icon || '📄',
        isActive: subtopic.isActive,
        order: subtopic.order,
      });
    } else {
      setEditingSubTopic(null);
      setSubTopicFormData({
        name: '',
        description: '',
        icon: '📄',
        isActive: true,
        order: subtopics.length,
      });
    }
    setShowSubTopicForm(true);
  };

  const closeForms = () => {
    setShowTopicForm(false);
    setShowSubTopicForm(false);
    setEditingTopic(null);
    setEditingSubTopic(null);
    setTopicFormData({
      name: '',
      description: '',
      icon: '📁',
      color: generateRandomColor(),
      isActive: true,
      order: topics.length,
    });
    setSubTopicFormData({
      name: '',
      description: '',
      icon: '📄',
      isActive: true,
      order: subtopics.length,
    });
  };

  const updateTopicForm = (data: Partial<TopicFormData>) => {
    setTopicFormData(prev => ({ ...prev, ...data }));
  };

  const updateSubTopicForm = (data: Partial<SubTopicFormData>) => {
    setSubTopicFormData(prev => ({ ...prev, ...data }));
  };

  return {
    topics,
    selectedTopic,
    subtopics,
    loading,
    showTopicForm,
    showSubTopicForm,
    editingTopic,
    editingSubTopic,
    topicFormData,
    subTopicFormData,

    refreshTopics,
    setSelectedTopic,
    createTopic,
    updateTopic,
    deleteTopic,
    createSubTopic,
    updateSubTopic,
    deleteSubTopic,
    
    openTopicForm,
    openSubTopicForm,
    closeForms,
    updateTopicForm,
    updateSubTopicForm,
  };
}
